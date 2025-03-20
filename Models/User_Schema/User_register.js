const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DB_CONNECTION, DATABASE1 } = process.env
const db = mongoose.createConnection(DB_CONNECTION + DATABASE1);
const user_schema = new Schema({
    user_id: { type: Number, default: 0 },
    user_name: { type: String, required: true, default: '' },
    password: { type: String, required: true, default: '' },
    rights: { type: String, required: true, default: '' }
})
user_schema.pre("save", async function (next) {
    //console.log(this.isNew);
    if (!this.isNew) {
        this.updated_at = IST(new Date())
        //  console.log('Updated-s');
        return next(); // Skip if not a new document or sl_no is already set
    } else {
        const result = await db.collection("users").findOne({ user_id: { $exists: true } }, { sort: { user_id: -1 } })
        let newSlNo = 1;
        if (result) {
            newSlNo = result.user_id + 1;
        }
        //console.log('Inserted-s');
        this.user_id = newSlNo;
        // this.created_date = IST(new Date())
        // this.created_date = IST(new Date())
        next();
    }
});
const New_user_schema = db.model('users', user_schema);


module.exports = New_user_schema;


