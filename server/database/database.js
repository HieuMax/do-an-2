const { Pool } = require('pg')
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

pool.connect()
    .then(client => {
        console.log('Connected to the database');
        client.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err.stack);
    });

module.exports = pool;