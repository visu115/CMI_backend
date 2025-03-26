const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../../Models/User');
const mongodb = require('mongodb')
const router = express.Router();

const { DB_CONNECTION, DATABASE1 } = process.env
const client = new mongodb.MongoClient(DB_CONNECTION);
const db = client.db(DATABASE1);

const register = require('../../Models/register')
const report = require('../../Models/Report/report')
router.post('/article_code_check', async (req, res) => {
    try {
        const { article_code } = req.body;
        //console.log(user_name);

        if (!article_code) {
            return res.status(400).json({ message: "article_code  Is Required" })
        }
        const articleres = await register.findOne({ article_code });
        if (!articleres) {
            return res.status(400).json({ message: "article_code is not available" })
        }
        return res.json({ data: articleres, message: "article code is available" })
    } catch (error) {
        return res.status(500).json({ message: "server error" })
    }
})

router.post('/save_final_report', async (req, res) => {
    const { user_name, rights, article_id, program_no, seam_name, section_seam_1, thread_tension,
        stiches_length, foot_pressure, no_stitches_max1, foot_height, sewing_speed, walkimg_fot_stoke,
        no_stitches_min1, no_stitches1, article_code, codereader1
    } = req.body
    try {
        const newReport = new report(req.body
            // user_name: user_name,
            // rights: rights,
            // article_id: article_id,
            // program_no: program_no,
            // seam_name: seam_name,
            // section_seam_1: section_seam_1,
            // thread_tension: thread_tension,
            // stiches_length: stiches_length,
            // foot_pressure: foot_pressure,
            // no_stitches_max1: no_stitches_max1,
            // foot_height: foot_height,
            // sewing_speed: sewing_speed,
            // walkimg_fot_stoke: walkimg_fot_stoke,
            // no_stitches_min1: no_stitches_min1,
            // no_stitches1: no_stitches1,
            // article_code: article_code,
            // codereader1: codereader1,
            // codereader2: codereader2,
            // codereader3: codereader3,
            // codereader4: codereader4,
            // codereader5: codereader5,
        );
        await newReport.save();
        return res.json({ message: "report saved successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "server error" })

    }

})
router.get('/getAllReport', async (req, res) => {
    try {
        console.log("Testing all users");
        const report = await db.collection("reports").find().toArray();
        console.log(report);
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
