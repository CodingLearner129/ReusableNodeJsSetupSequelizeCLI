export default {
    validation_error: "Validation Error",
    first_name: {
        required: "First name is required.",
        string: "First name must be a string.",
        minLength: "First name must have at least 2 characters.",
        maxLength: "First name cannot exceed 50 characters."
    },
    last_name: {
        required: "Last name is required.",
        string: "Last name must be a string.",
        minLength: "Last name must have at least 2 characters.",
        maxLength: "Last name cannot exceed 50 characters."
    },
    email: {
        required: "Email is required.",
        string: "Email must be a string.",
        email: "Invalid email format.",
        minLength: "Email must have at least 5 characters.",
        maxLength: "Email cannot exceed 320 characters.",
        unique: "Email already exists."
    },
    password: {
        required: "Password is required.",
        minLength: "Password must have at least 8 characters.",
        maxLength: "Password cannot exceed 15 characters.",
        upperLetterPassword: "Password must contain at least one uppercase letter.",
        lowerLetterPassword: "Password must contain at least one lowercase letter.",
        digitPassword: "Password must contain at least one digit.",
        specialLetterPassword: "Password must contain at least one special character.",
        pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    },
    current_password: {
        required: "Current Password is required.",
        minLength: "Current Password must have at least 8 characters.",
        maxLength: "Current Password cannot exceed 15 characters.",
        upperLetterPassword: "Current Password must contain at least one uppercase letter.",
        lowerLetterPassword: "Current Password must contain at least one lowercase letter.",
        digitPassword: "Current Password must contain at least one digit.",
        specialLetterPassword: "Current Password must contain at least one special character.",
        pattern: 'Current Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    },
    new_password: {
        required: "New Password is required.",
        minLength: "New Password must have at least 8 characters.",
        maxLength: "New Password cannot exceed 15 characters.",
        upperLetterPassword: "New Password must contain at least one uppercase letter.",
        lowerLetterPassword: "New Password must contain at least one lowercase letter.",
        digitPassword: "New Password must contain at least one digit.",
        specialLetterPassword: "New Password must contain at least one special character.",
        differentPassword: "New password must be different from the current password.",
        pattern: 'New Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    },
    page: {
        required: "Page is required.",
        min: "Page must be greater than :value.",
        max: "Page cannot exceed :value.",
        integer: "Page must be an integer."
    },    
    size: {
        required: "Size is required.",
        min: "Size must be greater than :value.",
        max: "Size cannot exceed :value.",
        integer: "Size must be an integer."
    },
    confirm_password: {
        required: "Confirm Password is required.",
        same: "Confirm password must match the new password.",
    },
    image: {
        image: "Please upload a valid image file.",
        required: "Image is required"
    },
    email_exists: "The email address you entered is already registered. Please use a different email address.",
}