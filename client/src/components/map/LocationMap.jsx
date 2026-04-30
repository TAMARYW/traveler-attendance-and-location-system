import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../api/apiService';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const teacherIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const convertToDecimal = (deg, min, sec) =>
    Number(deg) + (Number(min) / 60) + (Number(sec) / 3600);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const normalizeId = (id) => String(id).trim();

const LocationMap = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const teacherRef = useRef(null);

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(a => normalizeId(a.id) !== normalizeId(id)));
    };

    const fetchInitialData = useCallback(async () => {
        if (!user?.id || !user?.token) return;

        try {
            const teacherLoc = await apiService.getLocationByUserId(user.id);
            const data = await apiService.getLatestLocations(user.token);

            teacherRef.current = teacherLoc;
            setStudents(data);

            if (!teacherLoc) return;

            const tLat = convertToDecimal(teacherLoc.lat_deg, teacherLoc.lat_min, teacherLoc.lat_sec);
            const tLon = convertToDecimal(teacherLoc.lon_deg, teacherLoc.lon_min, teacherLoc.lon_sec);

            const initialAlerts = data
                .filter(loc => {
                    const dist = calculateDistance(
                        tLat,
                        tLon,
                        convertToDecimal(loc.lat_deg, loc.lat_min, loc.lat_sec),
                        convertToDecimal(loc.lon_deg, loc.lon_min, loc.lon_sec)
                    );
                    return dist > 3;
                })
                .map(loc => ({
                    id: loc.user_id,
                    name: loc.full_name || `Student ${loc.user_id}`
                }));

            setAlerts(initialAlerts);
        } catch (err) {
            console.error("Error loading data:", err);
        }
    }, [user?.id, user?.token]);

    useEffect(() => {
        if (!user?.id || !user?.token) return;

        fetchInitialData();

        const eventSource = new EventSource(
            `http://localhost:8080/api/locations/stream?token=${user.token}`
        );

        eventSource.onmessage = (event) => {
            const newLoc = JSON.parse(event.data);
            const studentId = normalizeId(newLoc.user_id);

            setStudents(prev => {
                const filtered = prev.filter(l => normalizeId(l.user_id) !== studentId);
                return [...filtered, newLoc];
            });

            const teacher = teacherRef.current;
            if (!teacher) return;

            const dist = calculateDistance(
                convertToDecimal(teacher.lat_deg, teacher.lat_min, teacher.lat_sec),
                convertToDecimal(teacher.lon_deg, teacher.lon_min, teacher.lon_sec),
                convertToDecimal(newLoc.lat_deg, newLoc.lat_min, newLoc.lat_sec),
                convertToDecimal(newLoc.lon_deg, newLoc.lon_min, newLoc.lon_sec)
            );

            if (dist > 3) {
                setAlerts(prev => {
                    if (prev.some(a => normalizeId(a.id) === studentId)) return prev;

                    return [
                        ...prev,
                        {
                            id: newLoc.user_id,
                            name: newLoc.full_name || "Student"
                        }
                    ];
                });
            } else {
                setAlerts(prev =>
                    prev.filter(a => normalizeId(a.id) !== studentId)
                );
            }
        };

        eventSource.onerror = () => eventSource.close();
        return () => eventSource.close();
    }, [fetchInitialData, user?.id, user?.token]);

    return (
        <div style={{ height: '600px', width: '100%', position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
            }}>
                {alerts.map(alert => (
                    <div
                        key={alert.id}
                        style={{
                            backgroundColor: '#ff4d4d',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <span>Student {alert.name} ({alert.id}) went too far!</span>

                        <button
                            onClick={() => removeAlert(alert.id)}
                            style={{
                                marginLeft: '10px',
                                background: 'white',
                                border: 'none',
                                color: '#ff4d4d',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            OK
                        </button>
                    </div>
                ))}
            </div>

            <MapContainer
                center={[31.7683, 35.2137]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {students.map(loc => {
                    const lat = convertToDecimal(loc.lat_deg, loc.lat_min, loc.lat_sec);
                    const lon = convertToDecimal(loc.lon_deg, loc.lon_min, loc.lon_sec);

                    const isMe =
                        normalizeId(loc.user_id) === normalizeId(user?.id);

                    return (
                        <Marker
                            key={loc.user_id}
                            position={[lat, lon]}
                            icon={isMe ? teacherIcon : DefaultIcon}
                        >
                            <Popup>
                                <strong>{isMe ? "Teacher" : loc.full_name}</strong><br />
                                ID: {loc.user_id}<br />
                                Last Update: {new Date(loc.recorded_at).toLocaleTimeString()}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default LocationMap;