const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const mongodb = require('mongodb')
const router = express.Router();

const { DB_CONNECTION, DATABASE1 } = process.env
const client = new mongodb.MongoClient(DB_CONNECTION);
const db = client.db(DATABASE1);

// const Admin = require('../../Models/Admin_Schema/Admin_register')
const New_user = require('../../Models/User_Schema/User_register')


module.exports = router;