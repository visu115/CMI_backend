const express = require('express');

const User = require('../../Models/User');
const mongodb=require('mongodb')
const router = express.Router();

const {DB_CONNECTION,DATABASE1}=process.env
const client = new mongodb.MongoClient(DB_CONNECTION);
const db = client.db(DATABASE1);


// Get all users





  router.get('/check_plc', async (req, res) => {
    try {
      console.log("Testing all users");
      const users = await db.collection("plc_database").find().sort({ _id: -1 }).limit(1).toArray();
      console.log(users);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });


  router.get('/check_db', async (req, res) => {
    try {
      console.log("Testing all users");
      const users = await db.collection("user_registrations").find().sort({ _id: -1 }).limit(1).toArray();
      console.log(users);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/check_aritical', async (req, res) => {
    console.log("Tamil Test");
    try {
      console.log("Testing all users");
      const users = await db.collection("article_scan").find().sort({ _id: -1 }).limit(1).toArray();
      console.log(users);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });




  module.exports = router;