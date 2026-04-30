const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');

const { validateRegisterStudent } = require('../middlewares/validation');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get(
  '/',
  verifyToken,
  studentController.getAllStudents
);

router.get(
  '/class/:class_number',
  verifyToken,
  studentController.getStudentsByClass
);

router.post(
  '/register',
  validateRegisterStudent,
  studentController.registerStudent
);

module.exports = router;