import apiClient from "./apiClient";

const apiService = {

    registerTeacher: async (teacherData) => {
        try {
            const response = await apiClient.post('/teachers/register', teacherData);
            return response.data;
        }
        catch (error) {
            throw error.response ? error.response.data : new Error('network error');
        }
    },

    loginTeacher: async (id, password) => {
        try {
            const response = await apiClient.post('/teachers/login', { id, password });
            return response.data;
        }
        catch (error) {
            throw error.response ? error.response.data : new Error('login error');
        }
    },

    getStudentsByClass: async (classNumber) => {
        try {
            const response = await apiClient.get(`/students/class/${classNumber}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Error fetching students');
        }
    },

    searchPerson: async (searchTerm) => {
        try {
            const response = await apiClient.get(`/teachers/search?term=${searchTerm}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Search error');
        }
    },

    registerStudent: async (studentData) => {
        try {
            const response = await apiClient.post('/students/register', studentData);
            return response.data;
        }
        catch (error) {
            throw error.response ? error.response.data : new Error('network error');
        }
    },

    getLatestLocations: async (token) => {
        try {
            const response = await apiClient.get('/locations/latest', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Error fetching locations');
        }
    },

    getLocationByUserId: async (userId, token) => {
        try {
            const response = await apiClient.get(`/locations/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Error fetching location');
        }
    },
}

export default apiService;