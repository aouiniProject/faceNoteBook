const { pool } = require('./../db/DB');
const jwtDecode = require('jwt-decode');

module.exports = (app) => {
    app.post(`/api/messages`, (response, req) => {

        const { username } = jwtDecode(response.body.token)
        pool.query('INSERT INTO messages (message, poster, receiver)  VALUES ($1, $2, $3)', [response.body.message, username, response.body.receiver])
            .then(res => req.send('Message has been sent'))
            .catch(err => console.log(err))

    })

    app.get('/api/getContacts/:token', (req, resp) => {
        const { username } = jwtDecode(req.params.token)

        pool.query(`SELECT poster, receiver FROM messages WHERE poster = $1 OR receiver = $1`, [username])
            .then(res => resp.send({ results: res.rows }))
            .catch(err => console.log(err))
    })

    app.get('/api/retrieve/:user/:contact', (req, resp) => {

        const { user, contact } = req.params

        pool.query(`SELECT poster, receiver, message FROM messages WHERE (poster = $1 AND receiver = $2) OR (poster = $2 AND receiver = $1)`, [user, contact])
            .then(res => resp.send(res.rows))
            .catch(err => console.log(err))

    })
}