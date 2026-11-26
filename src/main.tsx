import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './utils/ThemeContext';
import { AuthProvider } from './utils/AuthContext';
import { ContentProvider } from './utils/ContentContext';
import { FirestoreErrorBoundary } from './components/FirestoreErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <FirestoreErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <ContentProvider>
          <App />
        </ContentProvider>
      </AuthProvider>
    </ThemeProvider>
  </FirestoreErrorBoundary>
);
