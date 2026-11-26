import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkAdminAccess = async (firebaseUser: User | null): Promise<boolean> => {
    if (!firebaseUser || !firebaseUser.emailVerified) {
      return false;
    }
    if (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return true;
    }
    try {
      const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
      return adminSnap.exists() && adminSnap.data()?.role === 'admin';
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `admins/${firebaseUser.uid}`, false);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const adminStatus = await checkAdminAccess(firebaseUser);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const adminStatus = await checkAdminAccess(result.user);
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        setAuthError(
          `La cuenta ${result.user.email || ''} no tiene permisos de administrador autorizados para Club MC.`
        );
        await signOut(auth);
        return false;
      }
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Se cerró la ventana de Google antes de completar el acceso.');
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError(
          'Dominio no autorizado en Firebase Auth. Agrégalo en Firebase Console → Authentication → Settings → Authorized domains.'
        );
      } else if (code === 'auth/operation-not-allowed') {
        setAuthError(
          'Habilita el proveedor Google en Firebase Console → Authentication → Sign-in method.'
        );
      } else {
        setAuthError('No se pudo iniciar sesión con Google. Verifica tu conexión e inténtalo nuevamente.');
      }
      return false;
    }
  };

  const signOutAdmin = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch {
      // Ignore signout errors
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
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
