const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:8080/api/locations/update';
const API_KEY = process.env.LOCATION_API_KEY || 'HadassimProject2026';

const students = [
    { id: '222222222', name: 'Ayala', lat: 32.0853, lon: 34.7818 },
    { id: '333333333', name: 'Tovi', lat: 48.8566, lon: 2.3522 },
    { id: '987654321', name: 'Rivka', lat: 35.6895, lon: 139.6917 },
    { id: '123456789', name: 'Omer Rubin Teacher', lat: 31.7683, lon: 35.2137, isTeacher: true }
];

const toRad = (value) => (value * Math.PI) / 180;

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const sendLocationUpdate = async (user) => {
    const teacher = students.find(s => s.isTeacher);

    if (!user.isTeacher) {
        user.lat += (Math.random() - 0.5) * 0.02;
        user.lon += (Math.random() - 0.5) * 0.02;

        if (user.name === 'Ayala') {
            const distance = getDistanceKm(user.lat, user.lon, teacher.lat, teacher.lon);
            if (distance < 3) {
                user.lat += 0.05;
                user.lon += 0.05;
            }
        }
    }

    const data = {
        ID: user.id,
        Coordinates: {
            Longitude: {
                Degrees: String(Math.floor(user.lon)),
                Minutes: String(Math.floor((user.lon % 1) * 60)),
                Seconds: String(((user.lon * 3600) % 60).toFixed(0))
            },
            Latitude: {
                Degrees: String(Math.floor(user.lat)),
                Minutes: String(Math.floor((user.lat % 1) * 60)),
                Seconds: String(((user.lat * 3600) % 60).toFixed(0))
            }
        },
        Time: new Date().toISOString()
    };

    try {
        await axios.post(API_URL, data, {
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log(`[${new Date().toLocaleTimeString()}] Success: Updated ${user.name} in Nested Format`);
    } catch (error) {
        console.error(`Failed to update ${user.name}:`, error.response?.data || error.message);
    }
};

const startSimulation = () => {
    console.log("GPS Simulator started (Nested Format)...");
    setInterval(() => {
        students.forEach(student => sendLocationUpdate(student));
    }, 60000);
    students.forEach(student => sendLocationUpdate(student));
};

startSimulation();