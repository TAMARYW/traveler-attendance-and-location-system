import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import 'leaflet/dist/leaflet.css';
import './App.css';
import './styles/main.css';
import './styles/auth.css';
import './styles/navbar.css';
import './styles/home.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <AppRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;