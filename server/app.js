const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const locationRoutes = require('./routes/locationRoutes');

app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/locations', locationRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});