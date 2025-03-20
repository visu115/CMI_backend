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

const scan_data = require('../../Models/scan_data');

const GetData = require('../../eventEmitter');
var io ;
GetData.once('sok',(hh)=>{io=hh});
// Register route
router.get("/Dataa",(req,res)=>{
 io.emit('testingData', { test:"kij" });
 res.json({hii:"hii"})
})


router.get('/check_username', async (req, res) => {
  try{
    const {user_name} = req.query;
    //console.log(user_name);
    
    if(!user_name){
      return res.status(400).json({message:"User Name  Is Required"})
    }
    const existingUser = await register.findOne({user_name});
    if(existingUser){
      return res.json({have:false, message:"UserName is already taken"});
    }
    return res.json({have:true, message:"UserName is available"})
  }catch(error){
    return res.status(500).json({message:"server error"})
  }
})


router.post('/register', async (req, res) => {
  console.log(req.body);
  const { user_name } = req.body;

  try {
    
    // Check if the user already exists before saving
    const existingUser = await register.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new register(req.body); // Use User model (assuming you're using Mongoose for User)

        await scan.save();

   
        

    return res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);  // It's good to log the error for debugging purposes
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

// router.post('/register', async (req, res) => {
  
//   console.log(req.body);
//   const { user_name, password ,identification_no,rights,personal_id,photo,seam_name,seam_no,type,maxspeed1,abslong1,max1,stitch_length1,stl_corr_fak1,min1,stitches1,type2,max2,abslong2,maxspeed2,stitches2,min2,stl_corr_fak2,stitch_length2,type3,maxspeed3,abslong3,max3,stitches3,min3,stl_corr_fak3,stitch_length3 } = req.body;
//   try {
//   const values=new register({
//     user_name: user_name,
//     password: password,
//     identification_no: identification_no,
//   rights: rights,
//   time: new Date(),
//   date: new Date(),
//   personal_id: personal_id,
//   photo: null,
//   seam_no: seam_no,
//   seam_name: seam_name,
//   type: type,
//   maxspeed1: maxspeed1,
//   abslong1: abslong1,
//   max1: max1,
//   stitch_length1: stitch_length1,
//   stl_corr_fak1: stl_corr_fak1,
//   min1: min1,
//   stitches1: stitches1,
//   type2:type2,
//   max2: max2,
//   abslong2: abslong2,
//   maxspeed2: maxspeed2,
//   stitches2: stitches2,
//   min2: min2,
//   stl_corr_fak2: stl_corr_fak2,
//   stitch_length2: stitch_length2,
//   type3: type3,
//   maxspeed3: maxspeed3,
//   abslong3: abslong3,
//   max3: max3,
//   stitches3: stitches3,
//   min3: min3,
//   stl_corr_fak3: stl_corr_fak3,
//   stitch_length3: stitch_length3
//   })
//   await values.save();

//   res.status(201).json({ message: 'User registered successfully' });
  
//     const existingUser = await User.findOne({ user_name });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

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
