const express = require('express');
var mongoose = require('mongoose');
const app = express();
require('dotenv/config')
const cors = require('cors');
const bodyParser = require('body-parser');


app.listen(3000);

// Middleware
const postRoute = require('./routes/posts');
app.use('/posts', postRoute);
app.use(cors());
app.use(bodyParser.json());

// Routes 
app.get('/', (request, response) => {
    response.send("API Works..!!!");
});

// Connect to Mongo DB
mongoose.connect(process.env.DB_URL, 
    {useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to Mongo DB!!!"));


