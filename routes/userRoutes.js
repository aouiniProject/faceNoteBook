const { pool } = require('../db/DB');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

module.exports = (app) => {
    app.post('/api/signUp', (req, res) => {
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(req.body.password, salt)
        pool.query(`INSERT INTO users (userName, email, password, gender, followers) VALUES ( $1, $2, $3,$4, $5)`, [req.body.userName, req.body.email, hashedPass, req.body.gender, 0])
            .then(() => res.status(200).send('Your account is successfully inserted !!'))

            .catch((err) => res.status(400).send(err))

    })

    app.post('/api/userIn', (req, response) => {
        console.log(req.body)

        pool.query(`SELECT _id, username, email, password FROM users WHERE email = $1`, [req.body.email])
            .then(res => {
                console.log(res.rows);

                const validPass = bcrypt.compareSync(req.body.password, res.rows[0]["password"])
                if (!validPass) return response.status(400).send({ red: false, result: 'Invalid password' })
                console.log(res.rows[0]['_id'])
                const token = jwt.sign({ _id: res.rows[0]['_id'], username: res.rows[0]['username'] }, process.env.TOKEN_SECRET)
                response.header('auth-token', token).send({ red: true, token })
                // response.send('Logged in!')
            })
            .catch(err => res.send('Email is not found'))

    })

    app.get('/api/search/:username', (req, resp) => {

        pool.query(`SELECT username FROM users WHERE username LIKE $1`, ['%' + req.params.username + '%'])
            .then(res => {

                resp.status(200).send(res.rows)
            })
            .catch(err => resp.status(400).send(err))
    })

    app.post('/api/friendsRequests', (req, resp) => {
        console.log(req.body)
        const { username, receiver } = req.body

        pool.query(`INSERT INTO friends (sender, accepter, friends) VALUES ($1, $2, $3)`, [username, receiver, false])
            .then(() => console.log('done'))
            .catch(err => console.log(err))
    })


}