const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../../Models/User');
const mongodb=require('mongodb')
const router = express.Router();

const {DB_CONNECTION,DATABASE1}=process.env
const client = new mongodb.MongoClient(DB_CONNECTION);
const db = client.db(DATABASE1);

const register=require('../../Models/register')

const GetData = require('../../eventEmitter');
var io ;
GetData.once('sok',(hh)=>{io=hh});
// Register route
router.get("/Dataa",(req,res)=>{
 io.emit('testingData', { test:"kij" });
 res.json({hii:"hii"})
})

router.post('/register', async (req, res) => {
  
  console.log(req.body);
// debug.log(req.body);
  const {user_name} = req.body;
    
  try {

  const Auto = new register(req.body);
  await Auto.save();


  res.status(201).json({ message: 'User registered successfully' });
  
    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  console.log(req.body);
// debug.log(req.body);
  const {user_name} = req.body; 
  try {

  const Auto = new register(req.body);
  await Auto.save();


  res.status(201).json({ message: 'User registered successfully' });
  
    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/update_register', async (req, res) => {
  console.log("Update Request:", req.body);

  if (!req.body._id) {
    return res.status(400).json({ message: "User ID (_id) is required" });
  }

  try {
    const updatedUser = await register.findOneAndUpdate(
      { _id: req.body._id }, // Find user by ID
      req.body, // Update with new data
      { new: true, runValidators: true } // Return updated document & run validations
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



// // Login route
// router.post('/login', async (req, res) => {
//   console.log(req.body);
//   const { user_name, password } = req.body;
// //console.log(req.body);
//   try {
//     const user_login = await db.collection("user_registrations").findOne({user_name  });
//     console.log(user_login);



//     const options = {
//       hostname: 'localhost',
//       port: 1880,
//       path:  '/Dynamic_write',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     };
//     const req1 = http.request(options, (res1) => {
//       res1.on('data', (chunk) => {
//         console.log(chunk.toString());
        
  
//       });
//     });
    
//     req1.on('error', (error) => {
//       console.error("req1");
//     });



//     if (!user_login) {
//       req1.write(JSON.stringify({ data:2,address:"D236" }));
//       req1.end();
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     //const isMatch = await bcrypt.compare(password, user_login.password);
//     const isMatch = password === user_login.password;
    
//     if (!isMatch) {
//       req1.write(JSON.stringify({ data:2,address:"D236" }));
//       req1.end();
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // const token = jwt.sign(
//     //   { userId: user_login.Personal_id },
//     //   { expiresIn: '1h' }
//     // );
//     //console.log(token);
//     res.json(user_login);
//     //res.status(user_login);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });





// Get all users

router.get('/allUsers', async (req, res) => {
  try {
    console.log("Testing all users");
    const users = await db.collection("user_registrations").find().toArray();
    console.log(users);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// // Get Login users

// router.get('/loginUsers', async (req, res) => {
//   try {
//     console.log("Testing user search");

//     // Extract the username from query parameters
//     const { pharma: username } = req.query;  // 'pharma' is the query parameter key
    
//     if (!username) {
//       return res.status(400).json({ message: 'Username is required' });
//     }

//     // Query the database for users with the matching username
//     const users = await db.collection("user_registrations").find({ user_name: username }).toArray();

//     console.log(users);
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });


module.exports = router;
