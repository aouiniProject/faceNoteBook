const { pool } = require('../db/DB');

module.exports = (app) => {
    app.post('/api/post', (req, resp) => {

        const { username, post } = req.body;
        pool.query('INSERT INTO posts (poster, post) VALUES ($1, $2)', [username, post])
            .then(res => resp.send(res))
            .catch(err => console.log(err))
    })

    app.get('/api/getPosts/:user', (req, resp) => {
        // console.log(req.params)
        const { user } = req.params;
        let posts = []

        pool.query('select sender, accepter FROM friends WHERE sender = $1 AND friends = $2 OR accepter = $1 AND friends = $2', [user, true], (err, res) => {
            if (err) throw err
            res.rows.map(poster => {
                pool.query('SELECT poster, post FROM posts WHERE poster = $1', [poster.sender === user ? poster.accepter : poster.sender], (err, res) => {
                    if (err) throw err
                    if (res.rows[0]) {
                        posts.push(res.rows)
                    }
                })

            })

        })

        setTimeout(function () {
            resp.send(posts)

        }, 500);


    })
}