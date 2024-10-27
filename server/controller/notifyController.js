const pool = require('../database/database')
const { socketReceive, socketSend } = require('./websocket')

const createGroupConsumer = async(id, name) => { 
    console.log(id)
    console.log(name)
    const res = await pool.query('INSERT INTO groupconsumer (groupconsumerid, name_group) VALUES ($1, $2)', [id, name])
    if (res.error) {
        return { error: "error" }
    }
    console.log(id)

    return id
}

const checkExistConsumer = async (userId, groupId, type) => {
    if (type == "giangvien") {
        const response = await pool.query('SELECT * FROM consumers WHERE taikhoanid = (SELECT taikhoanid FROM giangvien WHERE giangvienid = $1) AND groupconsumerid = $2', [userId, groupId])
        if (response.rowCount > 0) {
            return { message: "existed consumer "}
        } else {
            await pool.query('INSERT INTO consumers (groupconsumerid, taikhoanid) VALUES ($1, (SELECT taikhoanid FROM giangvien WHERE giangvienid = $2))', [groupId, userId], (err, result) => {
                if (err) {
                    return { error: err }
                } else return { status: 201 }
            })
        }
    } else if (type == "sinhvien") {
        const response = await pool.query('SELECT * FROM consumers WHERE taikhoanid = (SELECT taikhoanid FROM sinhvien WHERE sinhvienid = $1) AND groupconsumerid = $2', [userId, groupId])
        if (response.rowCount > 0) {
            return { message: "existed consumer "}
        } else {
            await pool.query('INSERT INTO consumers (groupconsumerid, taikhoanid) VALUES ($1, (SELECT taikhoanid FROM sinhvien WHERE sinhvienid = $2))', [groupId, userId], (err, result) => {
                if (err) {
                    return { error: err }
                } else return { status: 201 }
            })
        }
    }
    // Check mentor in group consumer
    const response = await pool.query('SELECT * FROM consumers WHERE taikhoanid = (SELECT taikhoanid FROM giangvien WHERE giangvienid = $1) AND groupconsumerid = $2', [userId, groupId])
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
    if (type == "giangvien") { // Mentor
        let prevUid = userid
        const res = await pool.query('SELECT taikhoanid FROM giangvien WHERE giangvienid = $1', [userid])
        if (res.error) return { error: err }
        if (res.rows[0]) {
            prevUid = res.rows[0]
        }
        return prevUid
    } else if (type == "sinhvien") { // Student
        const res = await pool.query('SELECT taikhoanid FROM sinhvien WHERE sinhvienid = $1', [userid])
        if (res.error) return { error: err }
        return res.rows[0]
    } 
}

const getAdmin = async() => {
    const res = await pool.query('SELECT taikhoanid FROM bophanql')
    if (res.error) return { error: err }
    return res.rows
}

const createMsg = async (sender, topicId, msg, time_stamp, typeOfUser) => {
    const accountId = await getAccountId(sender, typeOfUser)
    if (!accountId) return { error: "internal error" }
    // console.log("From controller "+accountId + " - " + time_stamp + " - " + topicId + " - " + msg)
    pool.query('INSERT INTO unseenmsgs (taikhoanid, time_stamp, topicid, _message) VALUES ($1, $2, $3, $4)', [accountId.taikhoanid ? accountId.taikhoanid : accountId, time_stamp, topicId, msg], async (err, result) => {
        if(err) {
            return { error: err }
        } else {
            const result = await createCheckSeen()
            if (result.error) return { error: result.error }
            return { status: 201 }
        }
    })
}

const getNotifyById = async (id) => {
    const query = "SELECT messagesid FROM unseenmsgs WHERE messagesid = $1"
    const result = await pool.query(query, [id]);
    if (result.error) {
        return { error: result.error}
    }
    return result.rows[0]
}

const getLastestNotify = async () => {
    const result = await pool.query('SELECT * FROM unseenmsgs ORDER BY messagesid DESC LIMIT 1')
    return result.rows[0]
}

const getAllConsumerInGroup = async (groupId) => {
    const query = 'SELECT taikhoanid FROM consumers WHERE groupconsumerid = $1'
    const result = await pool.query(query, [groupId])
    return result.rows
}

const getGroupConsumer = async (topicId) => {
    const query = `SELECT groupconsumerid FROM topics WHERE id = $1`
    const result = await pool.query(query, [topicId]);
    return result.rows
}

const createCheckSeen = async () => {
    const mess = await getLastestNotify()
    const senderId = mess.taikhoanid
    const messId = mess.messagesid
    const topicId = mess.topicid
    const groupConsumerId = await getGroupConsumer(topicId)
    const consumerArr = []

    for(let groupid of groupConsumerId) {
        const acc = await getAllConsumerInGroup(groupid.groupconsumerid)
        const filteredAcc = acc.filter(item => item.taikhoanid !== senderId)
        // console.log(filteredAcc)
        consumerArr.push(filteredAcc)
    }
    const query = 'INSERT INTO seenmsgs (taikhoanid, messagesid) VALUES ($1, $2)'
    for (let receiver of consumerArr[0]) {
        const receiverId = receiver.taikhoanid
        // console.log(receiverId)
        const result = await pool.query(query, [receiverId, messId])
        if (result.error) return { error: result.error }
        return { status: 201 }
    }
    // const reuslt = await pool.query(query, [])
    // return { messId , consumerArr }
}

const getAllNotifies = async (userid) => {
    // console.log(userid)
    const query = `SELECT topics.title, topics.detaiid, unseenmsgs.time_stamp, unseenmsgs.taikhoanid, unseenmsgs._message, seenmsgs.seen, unseenmsgs.messagesid
                    FROM topics
                    INNER JOIN unseenmsgs ON unseenmsgs.topicid = topics.id
                    INNER JOIN seenmsgs ON seenmsgs.messagesid = unseenmsgs.messagesid
                    WHERE groupconsumerid IN (SELECT groupconsumerid FROM consumers WHERE taikhoanid = $1) AND unseenmsgs.taikhoanid != $1 AND seenmsgs.seen != TRUE
                    ORDER BY unseenmsgs.time_stamp DESC`
    try {
        const topics = await pool.query(query, [userid])
        return topics.rows
    } catch (error) {
        return { error }
    }
}

const getFullNotifies = async (userid) => {
    const query = `SELECT topics.title, topics.detaiid, unseenmsgs.time_stamp, unseenmsgs.taikhoanid, unseenmsgs._message, unseenmsgs.messagesid
    FROM topics
    INNER JOIN unseenmsgs ON unseenmsgs.topicid = topics.id
    WHERE groupconsumerid IN (SELECT groupconsumerid FROM consumers WHERE taikhoanid = $1) AND unseenmsgs.taikhoanid != $1
    ORDER BY unseenmsgs.time_stamp DESC`
    // console.log(userid)
    try {
        const topics = await pool.query(query, [userid])
        return topics.rows
    } catch (error) {
        return { error }
    }
}

const updateSeen = async (uid, messId) => {
    const query = 'UPDATE seenmsgs SET seen = TRUE WHERE taikhoanid = $1 AND messagesid = $2'
    const result = await pool.query(query, [uid, messId])
    if (result.error) return { error: result.error }
    return { status: 201 }
}

socketReceive(getAccountId, getAdmin);

const sendMessFromDb = (clientId) => {
    socketSend(clientId)
}

module.exports = {
    createTopic,
    getAllNotifies,
    createGroupConsumer,
    checkExistConsumer,
    createMsg,
    getAccountId,
    createCheckSeen,
    updateSeen,
    getFullNotifies,
}