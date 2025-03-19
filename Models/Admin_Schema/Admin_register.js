const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DB_CONNECTION, DATABASE1 } = process.env
const db = mongoose.createConnection(DB_CONNECTION + DATABASE1);
const New_admin = new Schema({
    username: { type: String, required: true, default: '' },
    password: { type: String, required: true, default: '' },
})

const Admin_schema = db.model('Admin', New_admin);
module.exports = Admin_schema;