const db = require('./db');

const Student = {

    getAll: async () => {
        try {
            const [rows] = await db.execute('SELECT * FROM Students');
            return rows;
        } catch (err) {
            throw err;
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM Students WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (err) {
            throw err;
        }
    },

    getByClass: async (classNumber) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM Students WHERE class_number = ?',
                [classNumber]
            );
            return rows;
        } catch (err) {
            throw err;
        }
    },

    search: async (term) => {
        try {
            const [rows] = await db.execute(
                "SELECT id, full_name, class_number, 'student' AS type FROM students WHERE full_name LIKE ? OR id LIKE ?",
                [`%${term}%`, `%${term}%`]
            );
            return rows;
        } catch (err) {
            throw err;
        }
    },

    create: async (studentData) => {
        const { id, full_name, class_number } = studentData;
        try {
            const [result] = await db.execute(
                'INSERT INTO Students (id, full_name, class_number) VALUES (?, ?, ?)',
                [id, full_name, class_number]
            );
            return result;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = Student;