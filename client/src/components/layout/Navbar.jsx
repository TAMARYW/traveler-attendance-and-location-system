import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">Attendance management system</div>
            <ul className="navbar-links">
                {user ? (
                    <>
                        <li>
                            <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>
                                Home Page
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/map" className={({ isActive }) => isActive ? 'active' : ''}>
                                Location Map
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/login" onClick={handleLogout}>
                                Log Out
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <li>
                        <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
                            Login
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;