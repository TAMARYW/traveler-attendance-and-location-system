import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Navbar from '../components/layout/Navbar';
import MapPage from '../pages/MapPage';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="loading-screen">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <>
            {user && <Navbar />}

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/map"
                    element={
                        <ProtectedRoute>
                            <MapPage />
                        </ProtectedRoute>
                    }
                />

\                <Route
                    path="*"
                    element={<Navigate to={user ? "/home" : "/login"} replace />}
                />
            </Routes>
        </>
    );
};

export default AppRoutes;