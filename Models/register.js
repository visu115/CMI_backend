const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DB_CONNECTION, DATABASE1 } = process.env
const db = mongoose.createConnection(DB_CONNECTION + DATABASE1);


const registerschema = new Schema({

  article_id: { type: Number, default: 0 },
  program_no: { type: Number, default: 0 },
  seam_name: { type: Number, default: 1 },
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
  codereader1: { type: String, default: '' },
  codereader2: { type: String, default: '' },
  codereader3: { type: String, default: '' },
  codereader4: { type: String, default: '' },
  codereader5: { type: String, default: '' },

});
registerschema.pre("save", async function (next) {
  //console.log(this.isNew);
  if (!this.isNew) {
    // this.updated_at = IST(new Date())
    //  console.log('Updated-s');
    return next(); // Skip if not a new document or sl_no is already set
  } else {
    const result = await db.collection("users_registrations").findOne({ article_id: { $exists: true } }, { sort: { article_id: -1 } })
    let newSlNo = 1;
    if (result) {
      newSlNo = result.article_id + 1;
    }
    //console.log('Inserted-s');
    this.article_id = newSlNo;
    // this.created_date = IST(new Date())
    // this.created_date = IST(new Date())
    next();
  }
});
const register = db.model('user_registrations', registerschema);
module.exports = register;
