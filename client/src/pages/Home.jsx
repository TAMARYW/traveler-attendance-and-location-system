import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/apiClient';
import Button from '../components/common/Button';
import '../styles/home.css';
import apiService from '../api/apiService'

const Home = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [showStudents, setShowStudents] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchClassStudents = async () => {
        if (!showStudents && user) {
            try {
                setLoading(true);
                const data = await apiService.getStudentsByClass(user.class_number);
                setStudents(data);
                setShowStudents(true);
            } catch (err) {
                console.error("Error fetching students:", err);
            } finally {
                setLoading(false);
            }
        } else {
            setShowStudents(false);
        }
    };

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 1) {
            try {
                const response = await apiClient.get(`/teachers/search?term=${term}`);
                setSearchResults(response.data);
            } catch (err) {
                console.error("Search error:", err);
            }
        } else {
            setSearchResults(null);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults(null);
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome, {user?.full_name}!</h1>
                <p>Class: {user?.class_number} | ID: {user?.id}</p>
            </header>

            <div className="search-section">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search student or teacher..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {searchTerm && <span className="clear-search" onClick={clearSearch}>✕</span>}
                </div>

                {searchResults && (
                    <div className="search-results">
                        {searchResults.length > 0 ? (
                            searchResults.map(result => (
                                <div key={result.id} className="search-item">
                                    <p>
                                        <strong>{result.full_name}</strong>
                                        {result.type === 'student' ? ' studies ' : ' teaches '}
                                        in class {result.class_number}, ID: {result.id}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="no-results">No results found.</p>
                        )}
                    </div>
                )}
            </div>

            <hr />

            <div className="students-section">
                <Button onClick={fetchClassStudents}>
                    {showStudents ? 'Hide Students' : 'Show My Students'}
                </Button>

                {loading && <p>Loading students...</p>}

                {showStudents && (
                    <div className="students-list">
                        <h3>Students in Class {user.class_number}:</h3>
                        {students.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Full Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>{student.full_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No students found in this class.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;