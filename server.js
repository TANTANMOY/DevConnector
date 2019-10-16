const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

//Body parser middleware

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


//DB config

const db = require('./config/keys').mongoURI;

// Connect to MongoDB

mongoose.connect(db)
    .then(() => console.log('mongoDb connected'))
    .catch(err => console.log(err));


app.get('/', (req, res) => res.send('hello'));

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server run on port ${port}`));