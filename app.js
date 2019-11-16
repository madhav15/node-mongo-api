const express = require('express');
var mongoose = require('mongoose');
const app = express();
require('dotenv/config')
const cors = require('cors');
const bodyParser = require('body-parser');


const Post = require('./model/Post');
const router = express.Router();
const amqp = require("amqplib");

app.listen(3000);

app.use(cors());
app.use(bodyParser.json());



// Connect to Mongo DB
mongoose.connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to Mongo DB!!!"));




async function connectAndSend(message) {

    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost");
        const channel = await connection.createChannel();
        const result = await channel.assertQueue("node-api-queue");

        channel.sendToQueue("node-api-queue", Buffer.from(JSON.stringify(message)));
        console.log(`Job sent successfully : ${message}`);
    }
    catch (ex) {
        console.error(ex)
    }

}

// Get all posts
app.get('/posts', async (request, response) => {
    try {
        const posts = await Post.find();
        connectAndSend({ "allPosts": posts });
        response.json(posts);
    } catch (error) {
        response.json({ message: error });
    }
});

// Get a specific post
app.get('/post/:postId', async (request, response) => {
    try {
        const post = await Post.findById(request.params.postId);
        connectAndSend({ "requestedPost": post });
        response.json(post);
    } catch (error) {
        response.json({ message: error });
    }
});

// Add new Post
app.post('/post', async (request, response) => {
    const post = new Post({
        title: request.body.title,
        description: request.body.description,
    });
    try {
        const savedPost = await post.save();
        connectAndSend({ "savedPost": savedPost });
        response.json(savedPost);
    } catch (error) {
        response.json({ message: error });
    }

});

// Delete a Post 
app.delete('/post/:postId', async (request, response) => {
    try {
        connectAndSend({ "removedPost": request.params.postId });
        console.log(request.params.postId);
        const removedPost = await Post.remove({ _id: request.params.postId });
        
        response.json(removedPost);
    } catch (error) {
        response.json({ message: error });
    }
});

// Update the post
app.patch('/post/:postId', async (request, response) => {
    try {
        const updatedPost = await Post.updateOne({ _id: request.params.postId },
            { $set: { title: request.body.title } });
        connectAndSend({ "updatedPost": updatedPost });
        response.json(updatedPost);
    } catch (error) {
        response.json({ message: error });
    }
});
