const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool, Client } = require('pg');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));

require('dotenv').config();
app.use(cors());

require('./routes/userRoutes')(app);
require('./routes/messagesRoutes')(app);
require('./routes/postsRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })

}



const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`listening on port ${port}`))