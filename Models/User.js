const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {DB_CONNECTION,DATABASE1}=process.env
const db = mongoose.createConnection(DB_CONNECTION+DATABASE1);



const UserSchema = new Schema({
  user_name: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User=db.model('user_registration', UserSchema);
module.exports = User

