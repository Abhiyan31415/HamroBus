const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the User schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Pre-save middleware to hash password if modified or new
UserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare plain password with hashed password
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

// Method to generate JWT for a user
UserSchema.methods.generateJWT = function() {
    return jwt.sign(
        { id: this._id, username: this.username }, 
        process.env.JWT_SECRET || 'default_jwt_secret', // Use env variable for security
        { expiresIn: '1h' }
    );
};

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
