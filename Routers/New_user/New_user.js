const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../../Models/User');
const mongodb = require('mongodb')
const router = express.Router();

const { DB_CONNECTION, DATABASE1 } = process.env
const client = new mongodb.MongoClient(DB_CONNECTION);
const db = client.db(DATABASE1);

const New_user = require('../../Models/User_Schema/User_register')
// const Admin = require
router.post('/New_user_register', async (req, res) => {
    console.log(req.body);
    const { username, password, rights } = req.body;

    try {

        // Check if the user already exists before saving
        const existingUser = await New_user.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new New_user({ user_name: username, password: password, rights: rights }); // Use User model (assuming you're using Mongoose for User)
        await newUser.save();

        return res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);  // It's good to log the error for debugging purposes
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login_check', async (req, res) => {
    console.log(req.body);
    const { user_name, password } = req.body;
    try {
        if (!user_name || !password) {
            return res.status(400).json({ message: "Username and Password are required" });
        }
        const adminCheck = await New_user.findOne({
            user_name: user_name,
            password: password
        });
        console.log('adminCheck', adminCheck);

        // const admin = new Admin(req.body); // Use User model (assuming you're using Mongoose for User)
        if (!adminCheck) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        res.json({ data: adminCheck, status: 'ok', access: 'admin', message: "Admin login matched" });
    } catch (error) {
        console.error(error);  // It's good to log the error for debugging purposes
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
