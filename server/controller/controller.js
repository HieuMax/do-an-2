const { json } = require('express');
const pool = require('../database/database')

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


// Update
const updateStatus = async (status, id) => {
    const query = `UPDATE detai SET trangthai = $1 WHERE detaiid = $2`
    try {
        const result = await pool.query(query, [status, id]);
        return {"status": 200, message: "Updated successfully"};
    } catch (err) {
        return {"error": err.message}        
    }
}

module.exports = {
    getAll,
    getById,
    getByKeyObject,
    updateStatus
}