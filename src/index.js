import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { authService } from './services/authService';
import { supabase } from './supabaseClient';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Add cookie checker function
const checkCustomCookie = () => {
  const cookies = document.cookie.split(';');
  const customCookie = cookies.find(cookie => cookie.trim().startsWith('custom_cookies='));
  
  if (!customCookie && supabase.auth.getSession()) {
    // If cookie is missing but user is logged in, force logout
    authService.logout();
  }
};

// Set up periodic cookie check (every 5 seconds)
setInterval(checkCustomCookie, 5000);
