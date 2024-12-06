import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import { ThemeProvider } from './components/context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
    <AuthProvider>
      <SnackbarProvider 
        preventDuplicate
        maxSnack={3} 
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: 'top', 
          horizontal: 'right'
        }}
        >
        <Router>
          <App />
        </Router>
      </SnackbarProvider>
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
reportWebVitals();
