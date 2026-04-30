const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');

exports.registerTeacher = async (req, res) => {
    try {
        const { id, full_name, class_number, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await Teacher.create({
            id,
            full_name,
            class_number,
            password_hash: hashedPassword
        });

        res.status(201).json({ message: "Teacher registered successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error registering teacher", error: err.message });
    }
};

exports.loginTeacher = async (req, res) => {
    const { id, password } = req.body;
    try {
        const teacher = await Teacher.getById(id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const isMatch = await bcrypt.compare(password, teacher.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        delete teacher.password_hash;
        const token = jwt.sign({ id: teacher.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: "Login successful", teacher, token });
    } catch (err) {
        res.status(500).json({ message: "Error during login process", error: err.message });
    }
};

exports.searchPerson = async (req, res) => {
    const { term } = req.query;
    if (!term) return res.status(200).json([]);

    try {
        const studentResults = await Student.search(term);
        const teacherResults = await Teacher.search(term);
        res.status(200).json([...studentResults, ...teacherResults]);
    } catch (err) {
        res.status(500).json({ message: "Search error", error: err.message });
    }
};

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.getAll();
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching teachers", error: err.message });
    }
};