const validateName = (name) => {
    return name && name.trim().length > 0 && name.trim().length <= 100;
};

const validateBio = (bio) => {
    return !bio || bio.length <= 500;
};

const validateLocation = (location) => {
    return !location || location.length <= 100;
};

const validateSkills = (skills) => {
    if (!skills) return true;
    if (!Array.isArray(skills)) return false;
    return skills.every(skill => 
        typeof skill === 'string' && 
        skill.trim().length > 0 && 
        skill.trim().length <= 50
    );
};

const validateAvailability = (availability) => {
    if (!availability) return true;
    if (!Array.isArray(availability)) return false;
    const validOptions = ['weekdays', 'weekends', 'evenings', 'mornings', 'afternoons'];
    return availability.every(avail => validOptions.includes(avail));
};

const validateProfileUpdate = (req, res, next) => {
    const { name, bio, location, skillsOffered, skillsWanted, availability, isPublic } = req.body;

    if (name !== undefined && !validateName(name)) {
        return res.status(400).json({
            success: false,
            message: 'Name must be between 1 and 100 characters'
        });
    }

    if (bio !== undefined && !validateBio(bio)) {
        return res.status(400).json({
            success: false,
            message: 'Bio must be 500 characters or less'
        });
    }

    if (location !== undefined && !validateLocation(location)) {
        return res.status(400).json({
            success: false,
            message: 'Location must be 100 characters or less'
        });
    }

    if (skillsOffered !== undefined && !validateSkills(skillsOffered)) {
        return res.status(400).json({
            success: false,
            message: 'Skills offered must be an array of strings (max 50 characters each)'
        });
    }

    if (skillsWanted !== undefined && !validateSkills(skillsWanted)) {
        return res.status(400).json({
            success: false,
            message: 'Skills wanted must be an array of strings (max 50 characters each)'
        });
    }

    if (availability !== undefined && !validateAvailability(availability)) {
        return res.status(400).json({
            success: false,
            message: 'Availability must be an array with valid options: weekdays, weekends, evenings, mornings, afternoons'
        });
    }

    if (isPublic !== undefined && typeof isPublic !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'isPublic must be a boolean value'
        });
    }

    next();
};

module.exports = {
    validateProfileUpdate
}; 