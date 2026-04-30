import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import apiService from '../api/apiService';
import Button from '../components/common/Button';
import '../styles/auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [role, setRole] = useState('student');

    const [values, handleChange] = useForm({
        id: '',
        full_name: '',
        class_number: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (role === 'teacher') {
                const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                if (!passwordRegex.test(values.password)) {
                    setError('Password must be at least 8 characters, include a number, uppercase and lowercase letter.');
                    return;
                }
                await apiService.registerTeacher(values);
            } else {
                await apiService.registerStudent(values);
            }

            alert('Registration successful! You can now login.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>{role === 'teacher' ? 'Teacher Registration' : 'Student Registration'}</h2>

            <div className="role-selection">
                <label>
                    <input
                        type="radio"
                        value="student"
                        checked={role === 'student'}
                        onChange={() => setRole('student')}
                    /> Student
                </label>
                <label>
                    <input
                        type="radio"
                        value="teacher"
                        checked={role === 'teacher'}
                        onChange={() => setRole('teacher')}
                    /> Teacher
                </label>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    name="full_name"
                    placeholder="Full Name"
                    value={values.full_name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="id"
                    placeholder="ID Number (9 digits)"
                    value={values.id}
                    onChange={handleChange}
                    required
                />
                <input
                    name="class_number"
                    placeholder="Class Number"
                    value={values.class_number}
                    onChange={handleChange}
                    required
                />

                {role === 'teacher' && (
                    <input
                        type="password"
                        name="password"
                        placeholder="Strong Password"
                        value={values.password}
                        onChange={handleChange}
                        required
                    />
                )}

                {error && <p className="error-message">{error}</p>}
                <Button type="submit">Register</Button>
            </form>
        </div>
    );
};

export default Register;