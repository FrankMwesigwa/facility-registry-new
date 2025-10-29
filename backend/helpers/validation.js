/**
 * Validation helper functions
 */

/**
 * Validate required fields
 */
export const validateRequired = (data, requiredFields) => {
    const missing = requiredFields.filter(field => !data[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone)) {
        throw new Error('Invalid phone number format');
    }
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim();
    }
    return input;
};

/**
 * Validate user registration data
 */
export const validateUserRegistration = (data) => {
    const requiredFields = ['email', 'password', 'firstname', 'lastname', 'username', 'phoneno', 'organisation', 'district_id'];
    validateRequired(data, requiredFields);
    
    validateEmail(data.email);
    validatePassword(data.password);
    validatePhoneNumber(data.phoneno);
    
    return {
        email: sanitizeInput(data.email),
        password: data.password,
        firstname: sanitizeInput(data.firstname),
        lastname: sanitizeInput(data.lastname),
        username: sanitizeInput(data.username),
        phoneno: sanitizeInput(data.phoneno),
        organisation: sanitizeInput(data.organisation),
        district_id: data.district_id
    };
};

/**
 * Validate login data
 */
export const validateLogin = (data) => {
    const requiredFields = ['username', 'password'];
    validateRequired(data, requiredFields);
    
    return {
        username: sanitizeInput(data.username),
        password: data.password
    };
};

/**
 * Validate profile update data
 */
export const validateProfileUpdate = (data) => {
    const sanitized = {};
    
    if (data.email) {
        validateEmail(data.email);
        sanitized.email = sanitizeInput(data.email);
    }
    
    if (data.phoneno) {
        validatePhoneNumber(data.phoneno);
        sanitized.phoneno = sanitizeInput(data.phoneno);
    }
    
    if (data.firstname) {
        sanitized.firstname = sanitizeInput(data.firstname);
    }
    
    if (data.lastname) {
        sanitized.lastname = sanitizeInput(data.lastname);
    }
    
    if (data.district_id) {
        sanitized.district_id = data.district_id;
    }
    
    return sanitized;
};
