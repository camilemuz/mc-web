import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
} from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isOwner: boolean;
  authReady: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOutAdmin: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkAdminAccess = useCallback(async (
    firebaseUser: User | null
  ): Promise<{ isAdmin: boolean; isOwner: boolean; reason?: string }> => {
    if (!firebaseUser || !firebaseUser.email) {
      return { isAdmin: false, isOwner: false, reason: 'No se recibió un correo electrónico válido desde Google.' };
    }
    if (!firebaseUser.emailVerified) {
      return {
        isAdmin: false,
        isOwner: false,
        reason: `El correo ${firebaseUser.email} no figura como verificado en Google/Firebase.`,
      };
    }
    const normalizedEmail = firebaseUser.email.trim().toLowerCase();
    if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      return { isAdmin: true, isOwner: true };
    }
    try {
      const adminSnap = await getDoc(doc(db, 'admins', normalizedEmail));
      const role = adminSnap.data()?.role;
      const authorized = adminSnap.exists() && (role === 'admin' || role === 'marketing');
      if (!authorized) {
        return {
          isAdmin: false,
          isOwner: false,
          reason: `La cuenta ${normalizedEmail} no está autorizada. Pide al propietario principal (${ADMIN_EMAIL}) que agregue tu correo en el Panel Admin → Equipo & Marketing.`,
        };
      }
      return { isAdmin: true, isOwner: false };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `admins/${normalizedEmail}`, false);
      const errMsg = error instanceof Error ? error.message : String(error);
      return {
        isAdmin: false,
        isOwner: false,
        reason: `Error al verificar permisos en Firestore (${errMsg}). Verifica que las reglas de Firestore estén publicadas.`,
      };
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const access = await checkAdminAccess(firebaseUser);
        setIsAdmin(access.isAdmin);
        setIsOwner(access.isOwner);
      } else {
        setIsAdmin(false);
        setIsOwner(false);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [checkAdminAccess]);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const access = await checkAdminAccess(result.user);
      setIsAdmin(access.isAdmin);
      setIsOwner(access.isOwner);
      if (!access.isAdmin) {
        setAuthError(
          access.reason ||
            `La cuenta ${result.user.email || ''} no está autorizada. Pide al propietario principal que agregue tu correo en el Panel Admin → Equipo & Marketing.`
        );
        await signOut(auth);
        return false;
      }
      return true;
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      const code = firebaseErr?.code || 'unknown';
      const rawMessage = firebaseErr?.message || '';
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Se cerró la ventana de Google antes de completar el inicio de sesión.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError(
          'El navegador bloqueó la ventana emergente de Google. Permite ventanas emergentes (pop-ups) para este sitio e inténtalo nuevamente.'
        );
      } else if (code === 'auth/cancelled-popup-request') {
        setAuthError('Ya hay una ventana de acceso de Google abierta. Completa o cierra esa ventana e intenta otra vez.');
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError(
          `Dominio no autorizado (${currentHost}). Agrégalo en Firebase Console → Authentication → Configuración → Dominios autorizados.`
        );
      } else if (code === 'auth/operation-not-allowed') {
        setAuthError(
          'El inicio de sesión con Google no está habilitado en Firebase Console → Authentication → Método de acceso.'
        );
      } else if (code === 'auth/network-request-failed') {
        setAuthError('Error de red al conectar con Google/Firebase. Revisa tu conexión o bloqueadores de anuncios.');
      } else {
        setAuthError(
          `No se pudo iniciar sesión con Google (${code}). ${rawMessage ? rawMessage : 'Verifica la configuración de Firebase Auth.'}`
        );
      }
      return false;
    }
  }, [checkAdminAccess]);

  const signOutAdmin = useCallback(async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setIsAdmin(false);
      setIsOwner(false);
    } catch {
      // Ignore signout errors
    }
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isOwner,
        authReady,
        authError,
        signInWithGoogle,
        signOutAdmin,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
