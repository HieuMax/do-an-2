const pool = require('../database/database')

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
    await pool.query('INSERT INTO topics (title, groupconsumerid, detaiid) VALUES ($1, $2, $3)', [title, groupConsumer, detaiid], async (err, result) => {
        if (err) {
            return { error: err }
        }
        const res = await pool.query('SELECT id FROM topics ORDER BY id DESC LIMIT 1')
        return res.rows[0]
    })
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
    console.log(sender)
    console.log(typeOfUser)
    const accountId = await getAccountId(sender, typeOfUser)
    if (!accountId) return { error: "internal error" }
    await pool.query('INSERT INTO unseenmsgs (taikhoanid, time_stamp, topicsid, message) VALUES ($1, $2, $3, $4)', [accountId, topicId, msg, time_stamp], (err, result) => {
        if(err) {
            return { error: err }
        } else return { status: 201 }
    })
}


const getAllNotifies = async (userid) => {
    const query = `SELECT topics.title, topics.detaiid, unseenmsgs.time_stamp, unseenmsgs.taikhoanid, unseenmsgs.message
                    FROM topics
                    INNER JOIN unseenmsgs ON unseenmsgs.topicsid = topics.id
                    WHERE groupconsumerid IN (SELECT groupconsumerid FROM consumers WHERE taikhoanid = $1)
                    ORDER BY unseenmsgs.time_stamp DESC`
    const topics = await pool.query(query, [userid])
    const now = Date.now()
    const sendTime = 1729173958803
    // const ago = time - 1729173958803
    // console.log(time.getTime())
    // console.log(Date(time))
    // const t = new Date(ago)
    // t.getTime();
    // const sendTime = time.getTime() - ago
    // console.log("time: ", time.getTime())
    // console.log("ago: ", ago)
    // console.log("date parse: ", new Date(time - ago).getMinutes())
    console.log(now)
    console.log(sendTime)
    const calcSentTime = new Date(Date.now() - (now - sendTime))
    console.log(`Calc sent time: ${calcSentTime.toTimeString()} - ${calcSentTime.toDateString() > new Date().toDateString()} - ${new Date().toDateString()}`)
    return topics.rows
}

module.exports = {
    createTopic,
    getAllNotifies,
    createGroupConsumer,
    checkExistConsumer,
    createMsg,
}