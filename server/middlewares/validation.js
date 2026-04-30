const validateRegisterStudent = (req, res, next) => {
    const { id, full_name, class_number } = req.body;

    if (!id || !/^\d{9}$/.test(id)) {
        return res.status(400).json({
            message: "ID must contain exactly 9 digits."
        });
    }

    if (!full_name || full_name.trim().length < 2) {
        return res.status(400).json({
            message: "Please enter a valid full name."
        });
    }

    if (class_number === undefined || class_number === null || isNaN(class_number)) {
        return res.status(400).json({
            message: "Class number must be a number."
        });
    }

    next();
};

const validateRegisterTeacher = (req, res, next) => {
    const { id, full_name, class_number, password } = req.body;

    if (!id || !/^\d{9}$/.test(id)) {
        return res.status(400).json({ message: "ID must contain exactly 9 digits." });
    }

    if (!full_name || full_name.trim().length < 2) {
        return res.status(400).json({ message: "Please enter a valid full name." });
    }

    if (class_number === undefined || isNaN(class_number)) {
        return res.status(400).json({ message: "Class number must be a number." });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number."
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { id, password } = req.body;

    if (!id || !/^\d{9}$/.test(id)) {
        return res.status(400).json({ message: "Invalid ID format. Must be 9 digits." });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required for login." });
    }

    next();
};

const validateLocation = (req, res, next) => {
    const { ID, Coordinates } = req.body;

    if (!ID || !/^\d{9}$/.test(String(ID))) {
        return res.status(400).json({ message: "Invalid student ID" });
    }

    if (
        !Coordinates ||
        !Coordinates.Longitude || !Coordinates.Latitude ||
        Coordinates.Longitude.Degrees === undefined ||
        Coordinates.Latitude.Degrees === undefined
    ) {
        return res.status(400).json({ message: "Missing or invalid coordinate structure" });
    }

    const lat = Number(Coordinates.Latitude.Degrees);
    const lon = Number(Coordinates.Longitude.Degrees);

    if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ message: "Coordinates must be numbers" });
    }

    if (lat < -90 || lat > 90) return res.status(400).json({ message: "Invalid latitude value" });
    if (lon < -180 || lon > 180) return res.status(400).json({ message: "Invalid longitude value" });

    next();
};

const validateById = (req, res, next) => {
    const { id } = req.body;
    if (!id || !/^\d{9}$/.test(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    next();
};

const validateIdParam = (req, res, next) => {
    const { id } = req.params;

    if (!id || !/^\d{9}$/.test(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    next();
};

module.exports = {
    validateRegisterStudent,
    validateRegisterTeacher,
    validateLogin,
    validateLocation,
    validateIdParam,
    validateById
};

