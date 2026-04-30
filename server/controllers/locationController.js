const Location = require('../models/locationModel');
const EventEmitter = require('events');
const locationEvents = new EventEmitter();

const lastUpdateTracker = {};

exports.updateLocation = async (req, res) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== process.env.LOCATION_API_KEY) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const { ID, Coordinates, Time } = req.body;

        if (!ID || !Coordinates) {
            return res.status(400).json({ message: "Invalid nested format" });
        }

        const flatData = {
            user_id: ID,
            lat_deg: Coordinates.Latitude.Degrees,
            lat_min: Coordinates.Latitude.Minutes,
            lat_sec: Coordinates.Latitude.Seconds,
            lon_deg: Coordinates.Longitude.Degrees,
            lon_min: Coordinates.Longitude.Minutes,
            lon_sec: Coordinates.Longitude.Seconds
        };

        const result = await Location.create(flatData);

        const now = Date.now();
        const studentId = String(ID);

        if (!lastUpdateTracker[studentId] || (now - lastUpdateTracker[studentId] >= 60000)) {

            const newLocation = {
                ...flatData,
                recorded_at: Time || new Date().toISOString()
            };

            locationEvents.emit('locationUpdate', newLocation);
            lastUpdateTracker[studentId] = now;
        }

        res.status(201).json({
            message: "Location saved to DB and broadcasted",
            id: result.insertId
        });

    } catch (err) {
        console.error("Controller Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.streamLocations = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendUpdate = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    locationEvents.on('locationUpdate', sendUpdate);

    req.on('close', () => {
        locationEvents.removeListener('locationUpdate', sendUpdate);
        res.end();
    });
};

exports.getLatestLocations = async (req, res) => {
    try {
        const locations = await Location.getLatest();
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving locations", error: err.message });
    }
};

exports.getLocationByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const location = await Location.getLocationByUserId(userId);
        res.status(200).json(location);
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving location",
            error: err.message
        });
    }
};