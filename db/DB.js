const { Pool, Client } = require('pg');
const pool = new Pool({
    user: 'amin',
    host: 'localhost',
    database: 'faceNoteBook',
    password: '123456789',
    port: 5432,
});

pool.connect()
    .then(() => console.log('database is connected'))
    .catch(e => console.log(e))

module.exports.pool = pool;