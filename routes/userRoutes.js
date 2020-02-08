const { pool } = require('../db/DB');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const jwtDecode = require('jwt-decode');

module.exports = (app) => {
    app.post('/api/signUp', (req, res) => {
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(req.body.password, salt)
        pool.query(`INSERT INTO users (userName, email, password, gender, followers) VALUES ( $1, $2, $3,$4, $5)`, [req.body.userName, req.body.email, hashedPass, req.body.gender, 0])
            .then(() => res.status(200).send('Your account is successfully inserted !!'))

            .catch((err) => res.status(400).send(err))

    })

    app.post('/api/userIn', (req, response) => {

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

    app.get('/api/search/:contact/:token', (req, response) => {
        const { username } = jwtDecode(req.params.token);
        const { contact } = req.params
        let results = {}

        pool.query(`SELECT DISTINCT username FROM users where (username LIKE $1 AND username != $2)`, ['%' + contact + '%', username])

            .then(resp => {

                results.users = resp.rows
            })
            .catch(err => response.status(400).send(err))
        if (pool.query(`SELECT sender, accepter, friends, request FROM friends WHERE ((sender = $1 AND accepter LIKE $2 AND ) OR (accepter = $1 AND sender LIKE $2))`, [username, '%' + contact + '%']).then(res => res)) {

            pool.query(`SELECT sender, accepter, friends, request FROM friends WHERE ((sender = $1 AND accepter LIKE $2) OR (accepter = $1 AND sender LIKE $2))`, [username, '%' + contact + '%'])
                .then(res => {
                    results.request = res.rows
                    response.status(200).send(results)

                })
                .catch(err => response.status(400).send(err))
        }

    })

    app.post('/api/friendsRequests', (req, resp) => {

        const { username, receiver } = req.body
        pool.query('SELECT sender, accepter FROM friends WHERE (sender = $1 AND accepter = $2) OR (sender = $2 AND accepter = $1)', [username, receiver])
            .then((res) => {
                console.log(res.rows[0])
                if (!res.rows[0]) {
                    pool.query(`INSERT INTO friends (sender, accepter, friends, request) VALUES ($1, $2, $3, $4)`, [username, receiver, false, true])
                        .then(res => {
                            resp.send('Invitation have been sent!!')
                            console.log('Request have been sent !!')
                        }
                        )
                        .catch(err => console.log(err))


                } else if (res.rows[0]) {
                    resp.send("You've sent invitation already!!")
                    pool.query('UPDATE friends SET request = $1, sender = $2, accepter = $3 WHERE accepter = $2 AND sender = $3 OR sender = $2 AND accepter = $3', [true, username, receiver])
                        .then(res => resp.send(res))
                        .catch(err => console.log(err))
                    console.log('nope')
                }

            })
            .catch(err => console.log(err))
    })

    app.put('/api/deleteRequest/:user/:contact', (req, resp) => {
        const { user, contact } = req.params;

        pool.query(`UPDATE friends SET request = $1 where sender = $2 AND accepter = $3 OR sender = $3 AND accepter = $2`, [false, user, contact])
            .then(res => resp.send(res))
            .catch(err => console.log(err))
    })

    app.get('/api/invites/:token', (req, resp) => {
        const { username } = jwtDecode(req.params.token);
        // console.log(username);
        pool.query('SELECT sender, friends, request FROM friends WHERE accepter = $1 AND friends = $2 AND request = $3', [username, false, true])
            .then(res => resp.send(res.rows))
            .catch(err => console.log(err))
    })

    app.put(`/api/sendInvites/:accepter/:accepted`, (req, resp) => {
        const { accepter, accepted } = req.params
        pool.query(`UPDATE friends SET friends = $1 WHERE sender = $2 AND accepter = $3 OR sender = $3 AND accepter = $2`, [true, accepted, accepter])
            .then(res => resp.send(res))
            .catch(err => console.log(err))
    })

    app.put(`/api/deleteFriend/:friend/:user`, (req, resp) => {
        console.log(req.params)
        const { friend, user } = req.params;

        pool.query('UPDATE friends SET friends = $1, request = $1 WHERE sender = $2 AND accepter = $3 OR accepter = $2 AND sender = $3', [false, friend, user])
            .then(res => resp.send(res))
            .catch(err => console.log(err))
    })

}