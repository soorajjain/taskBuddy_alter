import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals.ts';
import App from './App.tsx';
import LoginPage from './pages/LoginPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <App /> 
//  </React.StrictMode> 
);

reportWebVitals();
