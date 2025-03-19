const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {DB_CONNECTION,DATABASE1}=process.env
const db = mongoose.createConnection(DB_CONNECTION+DATABASE1);



const ScanSchema = new Schema({
  article_code: { type: String, required: true},
  codereader1: { type: String },
  codereader2: { type: String},
  codereader3: { type: String },
  codereader4: { type: String },
  codereader5: { type: String},
  user_name: { type: String }
});
const scan_data=db.model('article_scan', ScanSchema);
module.exports = scan_data

