const express = require('express');
const app = express();
const mongoose = require('mongoose');

//DB config

const db = require('./config/keys').mongoURI;

// Connect to MongoDB

mongoose.connect(db)
    .then(() => console.log('mongoDb connected'))
    .catch(err => console.log(err));


app.get('/', (req, res) => res.send('hello'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server run on port ${port}`));