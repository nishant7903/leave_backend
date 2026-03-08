import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate Access Token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY || 'employee_leave', {
        expiresIn: process.env.JWT_EXPIRY || '15m',
    });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_KEY || 'employee_leave_refresh', {
        expiresIn: process.env.REFRESH_EXPIRY || '7d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, empId, dob, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 
        $or: [{ email }, { empId }] 
    });

    if (userExists) {
        res.status(400);
        throw new Error('User with this email or Employee ID already exists');
    }

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        empId,
        dob,
        email,
        password,
        role: role || 'employee',
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            empId: user.empId,
            email: user.email,
            role: user.role,
            accessToken: generateAccessToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    // select('+password') is needed because we set select: false in the schema
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            accessToken: generateAccessToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Refresh an access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(401);
        throw new Error('Not authorized, no refresh token provided');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY || 'employee_leave_refresh');
        
        // Ensure user exists
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401);
            throw new Error('User not found');
        }

        res.json({
            accessToken: generateAccessToken(user._id)
        });
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed or expired');
    }
});

export {
    registerUser,
    loginUser,
    refreshAccessToken,
};
