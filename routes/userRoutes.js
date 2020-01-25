const { pool } = require('../db/DB')
const bcrypt = require('bcryptjs');

module.exports = (app) => {
    app.post('/api/signUp', (req, res) => {
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(req.body.password, salt)
        pool.query(`INSERT INTO users (userName, email, password, gender) VALUES ( $1, $2, $3,$4)`, [req.body.userName, req.body.email, hashedPass, req.body.gender])
            .then(() => res.status(200).send('Your account is successfully inserted !!'))
            .catch((err) => res.send('Your email is already used in an other account'))

    })

    app.post('/api/userIn', (req, response) => {
        console.log(req.body)

        pool.query(`SELECT email, password FROM users WHERE email = $1`, [req.body.email])
            .then(res => {
                const result = bcrypt.compareSync(req.body.password, res.rows[0]["password"])
                response.send(result)
            })
            .catch(err => console.log('nono: ' + err))

    })

}