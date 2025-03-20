const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DB_CONNECTION, DATABASE1 } = process.env
const db = mongoose.createConnection(DB_CONNECTION + DATABASE1);


const registerschema = new Schema({

  // user_name: { type: String, required: true, default: '' },
  // password: { type: String, required: true, default: '' },
  // identification_no: { type: String, default: '' },
  // rights: { type: String, default: 'user' },
  // time: { type: Date, default: Date.now },
  // date: { type: Date, default: Date.now },
  // personal_id: { type: String, default: '' },
  // photo: { type: Buffer,  default: null },
  program_no: { type: Number, default: 0 },
  seam_name: { type: Number, default: 0 },
  section_seam_1: { type: String, default: '' },
  thread_tension: { type: Number, default: 0 },
  stiches_length: { type: Number, default: 0 },
  foot_pressure: { type: Number, default: 0 },
  no_stitches_max1: { type: Number, default: 0 },
  foot_height: { type: Number, default: 0 },
  sewing_speed: { type: Number, default: 0 },
  walkimg_fot_stoke: { type: Number, default: 0 },
  no_stitches_min1: { type: Number, default: '' },
  no_stitches1: { type: Number, default: 0 },
  article_code: { type: String, required: true },
  codereader1: { type: String },
  codereader2: { type: String },
  codereader3: { type: String },
  codereader4: { type: String },
  codereader5: { type: String },
  user_name: { type: String }
  // section_seam_2: { type: String, default: 0 },
  // thread_tension_2: { type: Number, default: 0 },
  // stiches_length_2: { type: Number, default: 0 },
  // foot_pressure_2: { type: Number, default: 0 },
  // no_stitches_max2: { type: Number, default: 0 },
  // foot_height_2: { type: Number, default: 0 },
  // sewing_speed_2: { type: Number, default: 0 },
  // walking_fot_stoke2: { type: Number, default: '' },
  // no_stitches2: { type: Number, default: 0 },
  // no_stitches_min2: { type: Number, default: 0 },
  // section_seam_3: { type: String, default: 0 },
  // thread_tension_3: { type: Number, default: 0 },
  // stiches_length_3: { type: Number, default: 0 },
  // foot_pressure_3: { type: Number, default: 0 },
  // no_stitches_max3: { type: Number, default: 0 },
  // foot_height_3: { type: Number, default: 0 },
  // sewing_speed_3: { type: Number, default: 0 },
  // walkimg_fot_stoke3: { type: Number, default: 0 },
  // no_stitches3: { type: Number, default: 0 },
  // no_stitches_min3: { type: Number, default: 0 }
});
const register = db.model('user_registrations', registerschema);
module.exports = register;
