const Student = require('../models/studentModel');

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.getAll();
        res.status(200).json({ students });
    } catch (err) {
        res.status(500).json({ message: "Error fetching students", error: err.message });
    }
};

exports.registerStudent = async (req, res) => {
    try {
        const result = await Student.create(req.body);
        res.status(201).json({ message: "Student registered successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error registering student", error: err.message });
    }
};

exports.getStudentsByClass = async (req, res) => {
    const { class_number } = req.params;
    try {
        const students = await Student.getByClass(class_number);
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching class students", error: err.message });
    }
};