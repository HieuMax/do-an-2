const pool = require('../database/database')
const { socketReceive } = require('./websocket')

const createGroupConsumer = async(id, name) => { 
    const res = await pool.query('INSERT INTO groupconsumer (groupconsumerid, name_group) VALUES ($1, $2)', [id, name])
    if (res.error) {
        return { error: "error" }
    }
    return id
}

const checkExistConsumer = async (userId, groupId) => {
    // Check mentor in group consumer
    // console.log(userId, groupId)
    const response = await pool.query('SELECT * FROM consumers WHERE taikhoanid = (SELECT taikhoanid FROM giangvien WHERE giangvienid = $1) AND groupconsumerid = $2', [userId, groupId])
    // console.log(response.rows[0])
    if (response.rowCount > 0) {
        return { message: "existed consumer "}
    } else {
        await pool.query('INSERT INTO consumers (groupconsumerid, taikhoanid) VALUES ($1, (SELECT taikhoanid FROM giangvien WHERE giangvienid = $2))', [groupId, userId], (err, result) => {
            if (err) {
                return { error: err }
            } else return { status: 201 }
        })
    }
}

const createTopic = async (title, groupConsumer, detaiid=null) => {
    const result = await pool.query('INSERT INTO topics (title, groupconsumerid, detaiid) VALUES ($1, $2, $3)', [title, groupConsumer, detaiid])

    if (result.err) {
        return { error: result.err }
    }
    const res = await pool.query('SELECT id FROM topics ORDER BY id DESC LIMIT 1')
    return res.rows[0]
}

const getAccountId = async (userid, type) => {
    const allowedTables = ["giangvien", "sinhvien"]
    if(!allowedTables.includes(type)) return { error: "invalid table"}
    if (type == "giangvien") {
        const res = await pool.query('SELECT taikhoanid FROM giangvien WHERE giangvienid = $1', [userid])
        if (res.error) return { error: err }
        return res.rows[0]
    } else if (type == "sinhvien") {    
        const res = await pool.query('SELECT taikhoanid FROM sinhvien WHERE sinhvienid = $1', [userid])
        if (res.error) return { error: err }
        return res.rows[0]
    }
}

const createMsg = async (sender, topicId, msg, time_stamp, typeOfUser) => {
    const accountId = await getAccountId(sender, typeOfUser)
    if (!accountId) return { error: "internal error" }
    // console.log("From controller "+accountId.taikhoanid + " - " + time_stamp + " - " + topicId + " - " + msg)
    pool.query('INSERT INTO unseenmsgs (taikhoanid, time_stamp, topicid, _message) VALUES ($1, $2, $3, $4)', [accountId.taikhoanid, time_stamp, topicId, msg], (err, result) => {
        if(err) {
            return { error: err }
        } else return { status: 201 }
    })
}


const getAllNotifies = async (userid) => {
    // console.log(userid)
    const query = `SELECT topics.title, topics.detaiid, unseenmsgs.time_stamp, unseenmsgs.taikhoanid, unseenmsgs._message
                    FROM topics
                    INNER JOIN unseenmsgs ON unseenmsgs.topicid = topics.id
                    WHERE groupconsumerid IN (SELECT groupconsumerid FROM consumers WHERE taikhoanid = $1)
                    ORDER BY unseenmsgs.time_stamp DESC`
    try {
        const topics = await pool.query(query, [userid])
        return topics.rows
    } catch (error) {
        return { error }
    }
}

socketReceive(getAccountId);

module.exports = {
    createTopic,
    getAllNotifies,
    createGroupConsumer,
    checkExistConsumer,
    createMsg,
    getAccountId,
}