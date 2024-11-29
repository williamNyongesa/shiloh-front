import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App'
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
        anchorOrigin={
          {vertical: 'top', horizontal: 'right'}
      }>
        <Router>
          <App />
        </Router>
        </SnackbarProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
