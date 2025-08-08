import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // Correctly imported here
import { AuthProvider } from './contexts/AuthContext'; // Correctly imported here
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* BrowserRouter now wraps everything else, providing the routing context */}
        <BrowserRouter>
            {/* AuthProvider wraps App, making auth context available to all routes */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
