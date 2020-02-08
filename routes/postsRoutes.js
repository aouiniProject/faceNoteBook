const { pool } = require('../db/DB');

module.exports = (app) => {
    app.post('/api/post', (req, resp) => {
        console.log(req.body)
        const { username, post } = req.body;
        pool.query('INSERT INTO posts (poster, post) VALUES ($1, $2)', [username, post])
            .then(res => resp.send(res))
            .catch(err => console.log(err))
    })

    app.get('/api/getPosts/:user', (req, resp) => {
        console.log(req.params)
        const { user } = req.params;


        pool.query('select sender, accepter FROM friends WHERE sender = $1 AND friends = $2 OR accepter = $1 AND friends = $2', [user, true])
            .then(res => {
                // console.log(res.rows)
                let result = {}
                res.rows.map(poster => {
                    pool.query('SELECT poster, post FROM posts WHERE poster = $1', [poster.sender === user ? poster.accepter : poster.sender])
                        .then(res => {
                            console.log(res.rows)
                        })

                })


            })
            .catch(err => console.log(err))

        // pool.query('SELECT post, poster FROM posts WHERE ')
    })
}