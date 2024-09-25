const pool = require('../database/database')
const studentRouter = require('express').Router();

module.exports = studentRouter;

studentRouter.get('/', (req, res, next) => {
    pool.query("SELECT * FROM sinhvien", (err, results) => {
        if (err) {
            res.status(500).json({"error": err.message});
        } else {
            res.json({sinhvien: results.rows})
        }
    });
})