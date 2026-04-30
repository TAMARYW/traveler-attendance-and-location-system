import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import apiService from '../api/apiService';
import Button from '../components/common/Button';
import '../styles/auth.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [values, handleChange] = useForm({
        id: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await apiService.loginTeacher(values.id, values.password);

            login(userData);

            navigate('/home');
        } catch (err) {
            setError(err.message || 'Invalid ID or Password');
        }
    };

    return (
        <div className="auth-container">
            <h2>Teacher Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text"
                    name="id"
                    placeholder="ID Number"
                    value={values.id}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <Button type="submit">Login</Button>
            </form>
            <div className="auth-footer">
                <p>Not registered yet? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
};

export default Login;