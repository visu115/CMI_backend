const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const register = require('./Routers/register/register.js');
const checkuser = require('./Routers/CheckUser/checkuser.js');
const Admin = require('./Routers/Admin_route/Admin.js');
const NewUser = require('./Routers/New_user/New_user.js');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const eventEmitter = require('./eventEmitter');
const mongodb = require('mongodb')
const axiosInstance = require('./axiosInstance'); // Import the Axios instance
const moment = require('moment-timezone');

// Initialize Express app
const app = express();
app.use(cors());

// Create HTTP server and bind Socket.io to it
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());

let connectionDB = false;
let connectionPLC = false;



const { DB_CONNECTION, DATABASE1, PORT } = process.env;

// MongoDB connection
mongoose.connect(DB_CONNECTION + DATABASE1)
  .then(() => {
    connectionDB = true;
    console.log('MongoDB connected!');
    // io.emit('testingData', {db: 'connected' });
  })
  .catch((err) => {
    connectionDB = false;
    console.error('MongoDB connection error:', err);
  });
const client = new mongodb.MongoClient(DB_CONNECTION);
const db = client.db(DATABASE1);
// Routes
//const http=require('http')
app.use(register);
app.use(checkuser);
app.use(Admin);
app.use(NewUser);
var alrt = {}
var lastalrt = ''

// FinsConnection - fins api for writing values in different address
const FinsConnection = async (path = '', payload = {}, hostname = 'localhost', port = 1880) => {
  const options = {
    hostname,
    port,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };
  return await new Promise((resolve, reject) => {
    const req1 = http.request(options, (res1) => {
      //     res1.on('data', (chunk) => {
      //        console.log(chunk.toString());
      //        resolve(chunk.toString())
      // // checking[Object.keys(req.body)[0]]=false
      //     });
      let data = '';

      res1.on('data', (chunk) => {
        data += chunk.toString();  // Accumulate the data in case it's split across multiple chunks
      });

      res1.on('end', () => {
        // console.log(data);  // Final response data after all chunks have been received
        resolve({ Response: data, ...payload });
      });
    });

    req1.on('error', (error) => {
      // console.error("req1");
      reject(error)
    });
    req1.write(JSON.stringify({ ...payload }));
    req1.end();

  })
}

app.post('/testing', async (req, res) => {
  // console.log("Tami",req.body);

  //const {section, newValue} = req.body;

  //console.log(section);


  io.emit('testingData', { ...req.body });

  if (!alrt[Object.keys(req.body)[0]] && req.body && !Object.keys(req.body)[0].includes("0")) {
    if (lastalrt) {
      alrt[lastalrt] = false
    }
    alrt['session 0'] = false;
    // if(secData['session 2']){

    // }


    alrt[Object.keys(req.body)[0]] = true



    //io.emit('alert', { 
    // alerts:`${lastalrt?lastalrt+" Done, ":""}`+
    // `${Object.keys(req.body)[0].includes("4")?"":Object.keys(req.body)[0]+" started"}`
    // }); 

    lastalrt = Object.keys(req.body)[0]
    //console.log("Test Section",lastalrt);

  }
  else if (Object.keys(req.body)[0].includes("0") && !alrt[Object.keys(req.body)[0]] && lastalrt) {
    io.emit('alert', { alerts: `${lastalrt ? lastalrt + " Done, " : ""}` });
    lastalrt = ""

  }
  res.json({ message: "Received data" });
});



app.post('/checkStatus', async (req, res) => {

  //console.log("Testing1234",req.body);

  io.emit('check_status', { ...req.body, connectionDB, connectionPLC });



  res.json({ message: "Received data" });
});

// Define a schema for the messages
const messageSchema = new mongoose.Schema({
  s_no: Number,       // Serial number
  user_name: String,  // Store the user's name
  messages: [String], // An array of message strings
  createdAt: {        // Date and time in Chennai (Asia/Kolkata)
    type: Date,
    default: () => moment().tz('Asia/Kolkata').toDate(), // Set Chennai time as default
  },
});

// Create a model from the schema
const Message = mongoose.model('AlramMessage', messageSchema);

// Define a schema for auto-incrementing serial numbers (Counter collection)
const counterSchema = new mongoose.Schema({
  _id: String,  // The name of the sequence (e.g., 'message_sno')
  seq: {
    type: Number,
    default: 0 // Default value for sequence starts from 0
  }
});

// Create a model from the schema for the counter (Stored in 'counters' collection)
const Counter = mongoose.model('Counter', counterSchema);  // This will use 'counters' collection by default





// Function to get the next sequence number for 's_no'
async function getNextSequence(sequenceName) {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },  // Increment the counter by 1
    { new: true, upsert: true } // Create the counter if it doesn't exist
  );
  return counter.seq;
}

//  app.post("/AlramMsg", (req, res) => {
//   console.log(req.body.newMessages); // Correctly accessing the newMessages
//   res.status(200).send("Messages received successfully"); // Send a response back
// });

// Last Modification 

app.post("/AlramMsg", async (req, res) => {
  const { newMessages } = req.body;
  const { user_name } = req.body;
  try {
    // Get the next serial number (s.no)
    const nextSerialNo = await getNextSequence('s_no');

    let new_messages = [...new Set(newMessages)]

    // Create a new message document
    const message = new Message({
      s_no: nextSerialNo,     // Assign the auto-incremented serial number
      user_name: user_name,   // Store the user's name
      messages: new_messages,  // Store the array of messages
    });

    // Save the message to the database
    await message.save();

    //console.log("Messages saved to database:", new_messages);
    res.status(200).send("Messages received and saved successfully");
  } catch (error) {
    console.error("Error saving messages to the database:", error);
    res.status(500).send("Error saving messages to the database");
  }
});



// Checking For Tamil 
// app.post("/AlramMsg", async (req, res) => {
//   const { newMessages, user_name } = req.body;

//   try {

//     // Find the last inserted message for this user
//     const lastMessage = await Message.findOne({ user_name })
//       .sort({ s_no: -1 }) // Sort in descending order (latest first)
//       .limit(1);

//     // If the last message is the same as the new message, do not save
//     if (lastMessage && JSON.stringify(lastMessage.messages) === JSON.stringify(newMessages)) {
//       return res.status(409).send("Duplicate message, not saved");
//     }

//     // Get the next serial number (s_no)
//     const nextSerialNo = await getNextSequence('s_no');

//     // Create a new message document
//     const message = new Message({
//       s_no: nextSerialNo,     // Assign the auto-incremented serial number
//       user_name: user_name,   // Store the user's name
//       messages: newMessages,  // Store the array of messages
//     });

//     // Save the message to the database
//     await message.save();

//     console.log("Messages saved to database:", newMessages);
//     res.status(200).send("Messages received and saved successfully");

//   } catch (error) {
//     console.error("Error saving messages to the database:", error);
//     res.status(500).send("Error saving messages to the database");
//   }
// });




app.get('/getAlramMessages', async (req, res) => {
  const username = req.headers['username'];
  console.log(username);

  try {
    //const alarms = await Message.find(); // Fetch the data from the 'Message' collection
    const alarms = await Message.find({ user_name: username });
    res.json(alarms); // Send the data back to the frontend
  } catch (error) {
    console.error('Error fetching alarms:', error);
    res.status(500).send('Server Error');
  }
});







const checking = {}


app.post('/qrcode', async (req, res) => {

  if (req.body && req.body[Object.keys(req.body)[0]] && !checking[Object.keys(req.body)[0]] && Object.values(req.body)[0] !== '0') {

    io.emit('testingData', { ...req.body });
    //console.log("Testingggg");
    //console.log("Code Reader",Object.entries(req.body)[0]);   
    checking[Object.keys(req.body)[0]] = true
    try {
      const result = await db.collection('article_scan').findOne({ [Object.keys(req.body)[0]]: Object.values(req.body)[0] });

      const payload = { data: result ? 1 : 2, address: req.body.address };
      const nodeRedPath = '/Dynamic_write'; // Adjusted path without leading slash


      //       const options = {
      //         hostname: 'localhost',
      //         port: 1880,
      //         path: nodeRedPath,
      //         method: 'POST',
      //         headers: {
      //           'Content-Type': 'application/json',
      //         }
      //       };
      //       const req1 = http.request(options, (res1) => {
      //         res1.on('data', (chunk) => {
      //           // console.log(chunk.toString());

      // checking[Object.keys(req.body)[0]]=false
      //         });
      //       });

      //       req1.on('error', (error) => {
      //         console.error("req1");
      //       });
      //       req1.write(JSON.stringify({ ...payload }));
      //       req1.end();
      await FinsConnection(nodeRedPath, payload).then((output) => {
        // console.log("outputrt",output);
        checking[Object.keys(req.body)[0]] = false

      }).catch((err) => {
        console.log(err);
      })
      // const options2 = {
      //     hostname: 'localhost',
      //     port: 1880,
      //     path: nodeRedPath,
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     }
      //   };
      setTimeout(async () => {
        await FinsConnection(nodeRedPath, { data: 0, address: req.body.address }).then((output) => {
          // console.log("outputrt",output);


          checking[Object.keys(req.body)[0]] = false
        }).catch((err) => {
          console.log(err);
        })
        //       const req2 = http.request(options2, (res2) => {
        //         res2.on('data', (chunk) => {
        //           // console.log(chunk.toString());

        // checking[Object.keys(req.body)[0]]=false


        //         });

        //       });
        //       req2.on('error', (error) => {
        //         console.error("req2");
        //       });
        //       //console.log(req.body.address);
        //       req2.write(JSON.stringify({ data:0 ,address:req.body.address}));
        //       req2.end();
      }, 1000)
      res.json({ message: "Received data" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  } else {
    return res.status(400).json({ message: "Invalid request body" });
  }

  // if (req.body['D270'] === '1') {
  //   console.log("yyyy");
  //   try {
  //     const result1 = await db.collection('article_scan').findOne({ codereader1: req.body['D150'] });

  //     if (req.body) {
  //       const payload = { data: result1 ? 1 : 0 ,address:"D222"};

  //       const nodeRedPath = '/writeD222'; // Adjusted path without leading slash

  //       if (nodeRedPath) {
  //         const options = {
  //           hostname: 'localhost',
  //           port: 1880,
  //           path: nodeRedPath,
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           }
  //         };
  //         const req1 = http.request(options, (res1) => {
  //           res1.on('data', (chunk) => {
  //             console.log(chunk.toString());
  //           });
  //         });

  //         req1.on('error', (error) => {
  //           console.error(error);
  //         });
  //         req1.write(JSON.stringify({ ...payload }));
  //         req1.end();
  //       }
  //     }
  //     // Do not send another response here as it will cause headers sent error
  //     // res.json({ message: "Received Success" });
  //   } catch (error) {
  //     console.error(error);
  //     // Do not send another response here as it will cause headers sent error
  //     // res.status(500).json({ message: "An error occurred" });
  //   }
  // }
});


// app.get("/testof",(req,res)=>{

//     // const { D100, D102, D103, D104, D105,value, D106, D107, D108, D109, D110, D111, D112 } = req.body;
//     // console.log("Testing D100 Values", D100);

//     const options = {
//       hostname: 'localhost',
//       port: 1880,
//       path: '/writeD220',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',

//       }
//     };
//     const req1 = http.request(options, (res1) => {
//       // console.log(statusCode: ${res.statusCode});

//       res1.on('data', (chunk) => {
//         console.log(chunk.toString());
//       });
//     });

//     req1.on('error', (error) => {
//       console.error(error);
//     });
//     req1.write(JSON.stringify({payload:1}))
//     req1.end();


//   //const result = await collection.insertOne({ D100, D102, D103, D104, D105, D106, D107, D108, D109, D110, D111, D112 });

//     res.json({ message: "Received data" });

// })

// app.get('/testing', (req, res) => {
//   console.log("GET /testing endpoint working");
//   console.log("TT"+req.body);
//   res.json({ message: "Hi" });
// });






// Login route
app.post('/login', async (req, res) => {
  console.log(req.body);
  const { user_name, password } = req.body;

  // const options = {
  //   hostname: 'localhost',
  //   port: 1880,
  //   path:  '/Dynamic_write',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   }
  // };
  // const req1 = http.request(options, (res1) => {
  //   res1.on('data', (chunk) => {
  //     console.log(chunk.toString());


  //   });
  // });


  //console.log(req.body);
  try {
    const user_login = await db.collection("user_registrations").findOne({ user_name });
    console.log(user_login);








    if (!user_login) {
      await FinsConnection('/Dynamic_write', { data: 2, address: "D236" }).then((output) => {
        console.log("output", output);


      }).catch((err) => {
        console.log(err);
      })
      // req1.write(JSON.stringify({ data:2,address:"D236" }));
      // req1.end();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    //const isMatch = await bcrypt.compare(password, user_login.password);
    const isMatch = password === user_login.password;

    if (!isMatch) {
      await FinsConnection('/Dynamic_write', { data: 2, address: "D236" }).then((output) => {
        console.log("output", output);


      }).catch((err) => {
        console.log(err);
      })
      // req1.write(JSON.stringify({ data:2,address:"D236" }));
      // req1.end();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // const token = jwt.sign(
    //   { userId: user_login.Personal_id },
    //   { expiresIn: '1h' }
    // );
    //console.log(token);

    if (isMatch) {
      await FinsConnection('/Dynamic_write', { data: user_login.user_name, address: "D600" }).then((output) => {
        console.log("output", output);


      }).catch((err) => {
        console.log(err);
      })
    }


    res.json(user_login);
    //res.status(user_login);
  } catch (error) {
    await FinsConnection('/Dynamic_write', { data: 2, address: "D236" }).then((output) => {
      console.log("output", output);


    }).catch((err) => {
      console.log(err);
    })
    // req1.write(JSON.stringify({ data:2,address:"D236" }));
    //   req1.end();
    res.status(500).json({ message: 'Server error' });
  }
});





app.post('/swing', async (req, res) => {

  //console.log(req.body);


  if (req.body) {

    io.emit('testingData', { ...req.body });

    // console.log(Object.entries(req.body)[0]);   
    //   checking[Object.keys(req.body)[0]]=true
    try {
      // const result = await db.collection('article_scan').findOne({ [Object.keys(req.body)[0]]:Object.values(req.body)[0]});


      const payload = { data: req.body.value, address: req.body.address };

      const nodeRedPath = '/Dynamic_write'; // Adjusted path without leading slash

      await FinsConnection(nodeRedPath, payload).then((output) => {
        console.log("outputrt", output);

        checking[Object.keys(req.body)[0]] = false
      }).catch((err) => {
        console.log(err);
      })
      //       const options = {
      //         hostname: 'localhost',
      //         port: 1880,
      //         path: nodeRedPath,
      //         method: 'POST',
      //         headers: {
      //           'Content-Type': 'application/json',
      //         }
      //       };
      //       console.log("Writee",payload);

      //       const req1 = http.request(options, (res1) => {
      //         res1.on('data', (chunk) => {
      //            console.log(chunk.toString());

      // checking[Object.keys(req.body)[0]]=false
      //         });
      //       });

      //       req1.on('error', (error) => {
      //         console.error("req1");
      //       });
      //       req1.write(JSON.stringify({ ...payload }));
      //       req1.end();

      res.json({ message: "Received data" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  } else {
    return res.status(400).json({ message: "Invalid request body" });
  }


});












// Socket.io connection
// Socket.io connection

io.on('connection', async (socket) => {

  connectionPLC = true;
  console.log('New client connected');
  console.log('Client connected with socket ID:', socket.id);

  await FinsConnection('/Dynamic_write', { data: 1, address: "D236" }).then((output) => {
    console.log("output", output);


  }).catch((err) => {
    console.log(err);
  })
  // const options = {
  //   hostname: 'localhost',
  //   port: 1880,
  //   path:  '/Dynamic_write',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   }
  // };
  // const req1 = http.request(options, (res1) => {
  //   res1.on('data', (chunk) => {
  //     console.log(chunk.toString());


  //   });
  // });

  // req1.on('error', (error) => {
  //   console.error("req1");
  // });
  // req1.write(JSON.stringify({ data:1,address:"D236" }));
  // req1.end();

  //----------------------------------------------------------------------
  // Emit data to the client every second
  // const interval = setInterval(() => {
  //   const data = { message: 'This is live data', timestamp: new Date() };
  //   socket.emit('FromAPI', data);
  // }, 1000);


  socket.on("FromAPI", (data) => {
    console.log(data);
  })

  socket.on("CheckAPI", (data) => {
    console.log(data);
  })









  socket.on('disconnect', async () => {
    // clearInterval(interval);
    connectionPLC = false;
    console.log('Client disconnected');
    await FinsConnection('/Dynamic_write', { data: 0, address: "D236" }).then((output) => {
      console.log("output", output);

      // checking[Object.keys(req.body)[0]]=false
    }).catch((err) => {
      console.log(err);
    })
    // const options = {
    //   hostname: 'localhost',
    //   port: 1880,
    //   path:  '/Dynamic_write',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // };
    // const req1 = http.request(options, (res1) => {
    //   res1.on('data', (chunk) => {
    //     console.log(chunk.toString());


    //   });
    // });

    // req1.on('error', (error) => {
    //   console.error("req1");
    // });
    // req1.write(JSON.stringify({ data:0,address:"D236" }));
    // req1.end();

  });
});

// Start the server
const port = PORT || 5001;
server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

eventEmitter.emit('sok', io);