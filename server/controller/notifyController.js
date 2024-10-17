const pool = require('../database/database')

export const createTopic = async () => {
    await pool.query('INSERT INTO topics (title, groupconsumerid, detaiid) VALUES ($1, $2, $3)', [`Phê duyệt đề tài ${detaiId}`, "GVHD", detaiId])
}