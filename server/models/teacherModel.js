const db = require('./db');

const Teacher = {
    getAll: async () => {
        try {
            const [rows] = await db.execute('SELECT * FROM Teachers');
            return rows;
        } catch (err) {
            throw err;
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM Teachers WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (err) {
            throw err;
        }
    },

    create: async (teacherData) => {
        const { id, full_name, class_number, password_hash } = teacherData;
        try {
            const [result] = await db.execute(
                'INSERT INTO Teachers (id, full_name, class_number,password_hash) VALUES (?, ?, ?,?)',
                [id, full_name, class_number, password_hash]
            );
            return result;
        } catch (err) {
            throw err;
        }
    },

    search: async (term) => {
        try {
            const searchTerm = term || '';
            const [rows] = await db.execute(
                "SELECT id, full_name, class_number, 'teacher' AS type FROM teachers WHERE full_name LIKE ? OR id LIKE ?",
                [`%${searchTerm}%`, `%${searchTerm}%`]
            );
            return rows;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = Teacher;