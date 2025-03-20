const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {DB_CONNECTION,DATABASE1}=process.env
const db = mongoose.createConnection(DB_CONNECTION+DATABASE1);


const registerschema = new Schema({
    
    user_name: { type: String, required: true, default: '' },
    password: { type: String, required: true, default: '' },
    identification_no: { type: String, default: '' },
    rights: { type: String, default: 'user' },
    time: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    personal_id: { type: String, default: '' },
    photo: { type: Buffer,  default: null },
    seam_no: { type: Number, default: 0 },
    seam_name: { type: String, default: '' },
    type: { type: String, default: '' },
    maxspeed1: { type: Number, default: 0 },
    abslong1: { type: Number, default: 0 },
    max1: { type: Number, default: 0 },
    stitch_length1: { type: Number, default: 0 },
    stl_corr_fak1: { type: Number, default: 0 },
    min1: { type: Number, default: 0 },
    stitches1: { type: Number, default: 0 },
    type2: { type: String, default: '' },
    max2: { type: Number, default: 0 },
    abslong2: { type: Number, default: 0 },
    maxspeed2: { type: Number, default: 0 },
    stitches2: { type: Number, default: 0 },
    min2: { type: Number, default: 0 },
    stl_corr_fak2: { type: Number, default: 0 },
    stitch_length2: { type: Number, default: 0 },
    type3: { type: String, default: '' },
    maxspeed3: { type: Number, default: 0 },
    abslong3: { type: Number, default: 0 },
    max3: { type: Number, default: 0 },
    stitches3: { type: Number, default: 0 },
    min3: { type: Number, default: 0 },
    stl_corr_fak3: { type: Number, default: 0 },
  stitch_length3: { type: Number, default: 0 }
    
  });
const register=db.model('user_registration', registerschema);
module.exports = register;
