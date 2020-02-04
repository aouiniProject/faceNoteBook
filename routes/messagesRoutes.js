const { pool } = require('./../db/DB');
const jwtDecode = require('jwt-decode');

module.exports = (app) => {
    app.post(`/api/messages/`, (res, req) => {
        const username = jwtDecode(res.body.token).username
        pool.query('INSERT INTO messages (message, poster, receiver)  VALUES ($1, $2, $3)', [res.body.message, username, res.body.receiver])
            .then(res => console.log(4))
            .catch(err => console.log(err))
        // console.log(111, res.body, jwtDecode(res.body.token))
    })
}