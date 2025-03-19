const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const mongodb = require('mongodb')
const router = express.Router();

const { DB_CONNECTION, DATABASE1 } = process.env
const client = new mongodb.MongoClient(DB_CONNECTION);
const db = client.db(DATABASE1);

const Admin = require('../../Models/Admin_Schema/Admin_register')
router.post('/admin_register', async (req, res) => {
    console.log(req.body);
    const { user_name, password } = req.body;
    try {
        if (!user_name || !password) {
            return res.status(400).json({ message: "Username and Password are required" });
        }
        const adminCheck = await Admin.findOne({
            username: user_name.trim(),
            password: password.trim()
        });
        console.log(adminCheck);

        // const admin = new Admin(req.body); // Use User model (assuming you're using Mongoose for User)
        if (!adminCheck) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        res.json({ status: 'ok', access:'admin', message: "Admin login matched" });
    } catch (error) {
        console.error(error);  // It's good to log the error for debugging purposes
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;