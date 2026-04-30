import React from 'react';
import LocationMap from '../components/map/LocationMap';

const MapPage = () => {
    return (
        <div className="container mt-4" style={{ direction: 'rtl' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Real-Time Students Map</h2>
                <span className="badge bg-success">Live Updates Active</span>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-0" style={{ overflow: 'hidden', borderRadius: '8px' }}>
                    <LocationMap />
                </div>
                <div className="card-footer text-muted small">
                    The map updates automatically every 60 seconds based on GPS signals.
                </div>
            </div>
        </div>
    );
};

export default MapPage;