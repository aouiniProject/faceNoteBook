const { Pool, Client } = require('pg');
// const pool = new Pool({
//     user: 'amin',
//     host: 'localhost',
//     database: 'faceNoteBook',
//     password: '123456789',
//     port: 5432,
// });

const pool = new Pool({
    user: 'smnabegfpvxexs',
    host: 'ec2-54-195-247-108.eu-west-1.compute.amazonaws.com',
    database: 'd8ft64aa899lss',
    password: '4426143161bc76d529475d4d98c62fb8da525bb4952c00e685746e00e28a85d2',
    port: 5432,
});

pool.connect()
    .then(() => console.log('database is connected'))
    .catch(e => console.log(e))

module.exports.pool = pool;