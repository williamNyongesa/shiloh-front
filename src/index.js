import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
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
  </React.StrictMode>
);
reportWebVitals();
