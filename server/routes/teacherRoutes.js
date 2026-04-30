const express = require('express');
const router = express.Router();

const teacherController = require('../controllers/teacherController');

const { validateRegisterTeacher, validateLogin } = require('../middlewares/validation');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', validateRegisterTeacher, teacherController.registerTeacher);
router.post('/login', validateLogin, teacherController.loginTeacher);
router.get('/', verifyToken, teacherController.getAllTeachers);
router.get('/search', verifyToken, teacherController.searchPerson);

module.exports = router;