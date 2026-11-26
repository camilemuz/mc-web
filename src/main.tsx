import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './utils/ThemeContext';
import { ContentProvider } from './utils/ContentContext';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <ContentProvider>
      <App />
    </ContentProvider>
  </ThemeProvider>
);
