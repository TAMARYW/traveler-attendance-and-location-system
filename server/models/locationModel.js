const db = require('./db');

const Location = {

    create: async (data) => {
        const { user_id, lat_deg, lat_min, lat_sec, lon_deg, lon_min, lon_sec } = data;
        try {
            const [result] = await db.execute(
                `INSERT INTO Locations (user_id, lat_deg, lat_min, lat_sec, lon_deg, lon_min, lon_sec) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user_id, lat_deg, lat_min, lat_sec, lon_deg, lon_min, lon_sec]
            );
            return result;
        } catch (err) {
            throw err;
        }
    },

    getLatest: async () => {
        try {
            const [rows] = await db.execute(`
                SELECT l.*, s.full_name 
                FROM Locations l
                JOIN Students s ON l.user_id = s.id
                WHERE l.id IN (
                    SELECT MAX(id) FROM Locations GROUP BY user_id
                )
            `);
            return rows;
        }
        catch (err) {
            throw err;
        }
    }
    ,
    getLocationByUserId: async (userId) => {
        try {
            const [rows] = await db.execute(`
            SELECT *
            FROM Locations
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
        `, [userId]);

            return rows[0];
        } catch (err) {
            throw err;
        }
    }
};

module.exports = Location;