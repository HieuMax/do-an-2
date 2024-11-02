const pool = require('../database/database')
const { socketReceive, socketSend } = require('./websocket')

const createGroupConsumer = async(id, name) => { 
    // console.log(id)
    // console.log(name)
    const existQuery = 'SELECT * FROM groupconsumer WHERE groupconsumerid = $1'
    const existedGroup = await pool.query(existQuery, [id])
    if (existedGroup.error) return { error: existedGroup.error }
    if (existedGroup.rowCount > 0) return id 

    const res = await pool.query('INSERT INTO groupconsumer (groupconsumerid, name_group) VALUES ($1, $2)', [id, name])
    if (res.error) {
        return { error: "error" }
    }
    // console.log(id)

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
    const allowedTables = ["giangvien", "sinhvien", "quanly"]
    if(!allowedTables.includes(type)) return { error: "invalid table"}
    if (type == "giangvien") { // Mentor
        let prevUid = userid
        // console.log(userid)
        const res = await pool.query('SELECT taikhoanid FROM giangvien WHERE giangvienid = $1', [userid])
        if (res.error) return { error: err }
        if (res.rows[0]) {
            prevUid = res.rows[0]
        }
        // console.log(prevUid)
        return prevUid
    } else if (type == "sinhvien") { // Student
        const res = await pool.query('SELECT taikhoanid FROM sinhvien WHERE sinhvienid = $1', [userid])
        if (res.error) return { error: err }
        return res.rows[0]
    } else if (type == "quanly") {
        return userid
    }
}

const getAdmin = async() => {
    const res = await pool.query('SELECT taikhoanid FROM bophanql')
    if (res.error) return { error: err }
    return res.rows
}

const getAllMemOfCouncilById = async (councilId) => {
    const res = await pool.query(`SELECT giangvienid
        FROM thanhvienhd
        WHERE hoidongid = $1`, [councilId])
    if (res.error) {
        return { error: res.error }
    } 
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
    // console.log(consumerArr)
    for (let receiver of consumerArr[0]) {
        const receiverId = receiver.taikhoanid
        // console.log(receiverId)
        const result = await pool.query(query, [receiverId, messId])
        if (result.error) return { error: result.error }
    }
    return { status: 201 }
    // const reuslt = await pool.query(query, [])
    // return { messId , consumerArr }
}

const getAllNotifies = async (userid) => {
    // console.log(userid)
    const query = `SELECT DISTINCT topics.title, topics.detaiid, unseenmsgs.time_stamp, unseenmsgs.taikhoanid, unseenmsgs._message, seenmsgs.seen, unseenmsgs.messagesid
                    FROM topics
                    INNER JOIN unseenmsgs ON unseenmsgs.topicid = topics.id
                    INNER JOIN seenmsgs ON seenmsgs.messagesid = unseenmsgs.messagesid
                    WHERE groupconsumerid IN (SELECT groupconsumerid FROM consumers WHERE taikhoanid = $1) AND unseenmsgs.taikhoanid != $1 AND seenmsgs.seen != TRUE AND seenmsgs.taikhoanid = $1
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

const validateEnoughMarks = async (detaiid, type) => {
    const allowedTable = ['diemtailieudexuat', 'diemtailieuthuyetminh', 'diemtailieubaocao', 'uploadfile']
    if (!allowedTable.includes(type)) return
    if (type == allowedTable[3]) return true
    const query = `SELECT * FROM ${type} WHERE detaiid = $1`
    const result = await pool.query(query, [detaiid])
    return result.rowCount == 5
}

const getSubcriberOfGroupById = async(id) => {
    const query = `SELECT taikhoanid FROM consumers WHERE groupconsumerid = $1`
    const result = await pool.query(query, [id])
    return result.rows
}

const getTopicByIdnTitle =async (id, title) => {
    const query = 'SELECT * FROM topics WHERE detaiid = $1 AND title = $2'
    const result = await pool.query(query, [id, title])
    return { data: result.rows[0] }
}

const sendMessToMemsCouncil = async (councilId, detaiId, adminId) => {
    const mems = await getAllMemOfCouncilById(councilId)
    const groupid = await createGroupConsumer(`PCHD_${councilId}`, `Hội đồng ${councilId}`)
    const memArr = [] // To send socket 
    if(groupid) {
        for (let mem of mems) {
            const uid = await getAccountId(mem.giangvienid, "giangvien")
            const accountId = await uid.taikhoanid
            memArr.push(accountId)
            await checkExistConsumer(mem.giangvienid, groupid, "giangvien") // Assign mentor to groupConsumer
        }
        const topicId = await createTopic(`Hội đồng chấm điểm`, groupid, detaiId) // Create topic for groupConsumer subcribe
        // const student = await getById('students', valuesArray[5])
        const msg = `Đề tài ${detaiId} được phân công cho hội đồng ${councilId}, giờ đây bạn có thể xem đề tài.`
        await createMsg(adminId, topicId.id, msg, Date.now(), "quanly") // Student sent - so get type of student
        for (let client of memArr) {
            sendMessFromDb(client)
        }
    }
    // return memArr
}

//
// Function when all of members in coucil marked PROJECT 
//
const notify_upload_proposal = async (id, typeOfDoc, titleTopic, msg) => {
    const check = await validateEnoughMarks(id, typeOfDoc);

    if (!check) return;     // Check exists 5 records in table 

    const topicId = await getTopicByIdnTitle(id, titleTopic)
    if (!topicId) return; 
    const groupid = await topicId.data.groupconsumerid
    const message = `Đề tài ${id} ` + msg;
    const system = await pool.query(`SELECT taikhoanid FROM taikhoan WHERE vaitro = $1 AND taikhoan."_webSocket" = $2`, ['Admin', true]) // System 
    await createMsg(system.rows[0], topicId.data.id, message, Date.now(), "quanly") // Admin sent - so get type of quanly
    const subcribers = await getSubcriberOfGroupById(groupid)

    for (let client of subcribers) {
        console.log(client.taikhoanid)
        sendMessFromDb(client.taikhoanid)
    }   
}

//
// Function when student UPLOAD PROPOSAL 
//

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
    sendMessToMemsCouncil,
    notify_upload_proposal
}