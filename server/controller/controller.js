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
    }
}

const getAllFromDb = async (name) => {
    // prevent SQL injection
    const allowedTables = ['sinhvien', 'giangvien', 'detai'];
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
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
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


module.exports = {
    getAll,
    getById
}