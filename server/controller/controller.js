const { json } = require('express');
const pool = require('../database/database')
const path = require('path');

const getAll = (name) => {
    switch (name) {
        case 'students':
            return getAllFromDb('sinhvien');
        case 'mentors':
            return getAllFromDb('giangvien');
        case 'projects':
            return getAllFromDb('detai');
        case 'departments':
            return getAllFromDb('khoa');
        case 'classes':
            return getAllFromDb('lop');
        default: 
            return
    }
}

const getAllFromDb = async (name) => {
    // prevent SQL injection
    const allowedTables = ['sinhvien', 'giangvien', 'detai', 'khoa', 'lop'];
    if (!allowedTables.includes(name)) {
        return json({"error": "Invalid table name"});
    }

    const query = `SELECT * FROM ${name}`;
    
    try {
        const results = await pool.query(query);
        return {"data": results.rows};
    } catch (err) {
        return {"error": err.message};
    }
};

const getById = (obj, id) => {
    switch (obj) {
        case 'students':
            return getStudentById(id);
        case 'mentors':
            return getMentorById(id);
        case 'projects':
            return getProjectById(id);
        case 'departments':
            return getDepartmentById(id);
        case 'classes':
            return getClassById(id);
        default: 
            return
    }
}

const getByKeyObject = (table, key, obj) => {
    switch (table) {
        case "mentors": 
            return getMentorByQuery(key, obj)
        default: 
            return
    }
}

const getStudentById = async(id) => {
    const query = "SELECT * FROM sinhvien WHERE sinhVienID = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}
const getProjectById = async(id) => {
    const query = "SELECT * FROM detai WHERE detaiid = $1"
    const member = await getMemberOfProject(id);
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0], "members": member};
    } catch (err) {
        return {"error": err.message};
    }
}
const getMentorById = async(id) => {
    const query = "SELECT * FROM giangvien WHERE giangvienid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}

const getMentorByQuery = async(key, obj) => {
    const allowedTables = ['khoaid'];
    if (!allowedTables.includes(key)) {
        return json({"error": "Invalid table name"});
    }
    const query = `SELECT * FROM giangvien WHERE ${key} = $1`
    try {
        const results = await pool.query(query, [obj]);
        return {"data": results.rows};
    } catch (err) {
        return {"error": err.message};
    }
}

const getDepartmentById = async(id) => {
    const query = "SELECT * FROM khoa WHERE khoaid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}
const getClassById = async(id) => {
    const query = "SELECT * FROM lop WHERE lopid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}

const getMemberOfProject = async(id) => {
    const query = `
    SELECT sinhvien.sinhvienid, sinhvien.hoten
    FROM thanhvienthuchien 
    INNER JOIN sinhvien ON sinhvien.sinhvienid = thanhvienthuchien.sinhvienid
    WHERE detaiid = $1 `
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows};
    } catch (err) {
        return {"error": err.message};
    }
}

const getLastIdProject = async () => {
    try {
        const results = await pool.query("SELECT detaiid FROM detai ORDER BY detaiid DESC LIMIT 1")
        return { "data": results.rows[0] }
    } catch (error) {
        return { "error": error.message }
    }
}

const getMarkOfProject = async(detaiid, role, userid) => {
    if (role == "nguoichamdiem") {
        const query = `SELECT * FROM diemtailieuthuyetminh WHERE detaiid = $1 AND nguoichamdiem = $2`
        const result = await pool.query(query, [detaiid, userid])
        // console.log(result)
        return { "data": result.rows }
        
    } else if(role == "sinhvien") {
        const query = `SELECT * FROM diemtailieuthuyetminh WHERE detaiid = $1`
        const result = await pool.query(query, [detaiid])
        return { "data": result.rows }

    }
}

const getProposalFile = async(detaiid) => {
    const query = `SELECT * FROM tailieuthuyetminh WHERE detaiid = $1`
    const result = await pool.query(query, [detaiid])
    return { data: result.rows[0] }
}

// Update
const updateStatus = async (status, id) => {
    const query = `UPDATE detai SET trangthai = $1 WHERE detaiid = $2`
    try {
        await pool.query(query, [status, id]);
        return {"status": 200, message: "Updated successfully"};
    } catch (err) {
        return {"error": err.message}        
    }
}
const updateFile = async (type, id, file) => {
    const allowedTypes = ['tailieudexuat']
    if (!allowedTypes.includes(type)) {
        return json({"error": "Invalid type name"});
    }
    switch(type){
        case "tailieudexuat":
            const query = `UPDATE detai SET tailieudexuat = $1 WHERE detaiid = $2`
            try {
                await pool.query(query, [file, id]);
                return {"status": 200, message: "Updated successfully"};
            } catch (err) {
                return {"error": err.message}        
            }
        default:
            return
    }
}

//
// POST -------------------------
//

const registNewProject = async (data) => {
    const columns = Object.keys(data)
    columns.splice(columns.indexOf("thanhVienThucHien"), 1)
    columns.join(', ')
    const valuesArray = Object.values(data);
    const memList = valuesArray.splice(5, 1)[0]
    const detaiId = data.detaiid
    const text = `INSERT INTO detai (${columns}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
    const query = {
        text: text,
        values: valuesArray
    }

    try {
        const result = await pool.query(query)
        if(result.error) {
            throw result.error
        }
        for(let mem of memList) {
            const query_memList = `INSERT INTO thanhvienthuchien (detaiid, sinhvienid) VALUES ($1, $2)`
            const result_memList = await pool.query(query_memList, [detaiId, mem.sinhvienid])
            // console.log(mem)
            if(result_memList.error) {
                throw result_memList.error
            }
        }
        // console.log(result)
        return { status: 201 }
    } catch (error) {
        return {"error": error.message}
    }
}

const uploadProposal = async (data) => {
    try {
        const values = Object.values(data)
        const text = `INSERT INTO tailieuthuyetminh (tailieupath, detaiid, ngaynop, originalfilename) VALUES ($1, $2, $3, $4)`
        const query = {
            text: text,
            values: values
        }
        const result = await pool.query(query)
        if(result.error) {
            throw result.error
        }
        return { status: 201 }
    } catch (error) {
        return {"error": error.message}
    }
}

const permission = async(token, detaiid) => {
    const a = await pool.query(`SELECT hoidongphancong FROM detai WHERE detaiid = $1`, [detaiid])
    const hoidongid = await a.rows[0].hoidongphancong;
    const b = await pool.query('SELECT * FROM thanhvienhd WHERE hoidongid = $1 AND giangvienid = $2', [hoidongid, token])
    if(b.rows[0]) {
        return true
    }
    return false
}

const markProject = async(type, data) => {
    const allowedTables = ["diemtailieuthuyetminh"]
    if(!allowedTables.includes(type)) {
        return json({ status: 500, message: "Invalid server" })
    }
    const permis = await permission(data.nguoichamdiem, data.detaiid)
    if(!permis) {
        return { "Error": "Not permission" }
    } else {
        const query = `INSERT INTO diemtailieuthuyetminh (nguoichamdiem, diemtailieu, nhanxet, detaiid, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8) VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
        try {
            const result = await pool.query(query, [data.nguoichamdiem, data.mark, data.comment, data.detaiid, data.diemtc1, data.diemtc2, data.diemtc3, data.diemtc4, data.diemtc5, data.diemtc6, data.diemtc7, data.diemtc8])
            if(result.error) {
                throw result.error
            }
            return { status: 201 }

        } catch (error) {
            return { "error": error }
        }
    }
}

const markType = (type, data) => {
    switch(type){
        case "ThuyetMinh":
            return markProject("diemtailieuthuyetminh", data)
        default: 
            return
    }
}

//
// DOWNLOAD --------------------------------
//
const downloadFile = (req) => {
    const filepath = path.join(__dirname, "../")
    return path.join(filepath, 'files-upload', req)
}


module.exports = {
    getAll,
    getById,
    getByKeyObject,
    updateStatus,
    getLastIdProject,
    registNewProject,
    updateFile,
    downloadFile,
    markType,
    getMarkOfProject,
    uploadProposal,
    getProposalFile
}