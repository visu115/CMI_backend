const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../../Models/User');
const mongodb=require('mongodb')
const router = express.Router();

const {DB_CONNECTION,DATABASE1}=process.env
const client = new mongodb.MongoClient(DB_CONNECTION);
const db = client.db(DATABASE1);

const New_user = require('../../Models/User_Schema/User_register')
const Admin=require
router.post('/register', async (req, res) => {
    console.log(req.body);
    const { user_name } = req.body;

    try {

        // Check if the user already exists before saving
        const existingUser = await New_user.findOne({ user_name });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new New_user(req.body); // Use User model (assuming you're using Mongoose for User)

       
            await newUser.save();
        console.log("Scan Data", scan);

        await scan.save();


        return res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);  // It's good to log the error for debugging purposes
        res.status(500).json({ message: 'Server error' });
    }
});