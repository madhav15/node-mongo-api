const express = require('express');
const Post = require('../model/Post');
const router = express.Router();


// Get all posts
router.get('/', async (request, response) => {
    try {
        const posts = await Post.find();
        response.json(posts);
    } catch(error) {
        response.json({message : error});
    }
});

// Get a specific post
router.get('/:postId', async (request, response) => {
    try {
        const post = await Post.findById(request.params.postId);
        response.json(post);
    } catch(error) {
        response.json({message : error});
    }
});

// Add new Post
router.post('/', async (request, response) => {
    const post = new Post({
        title: request.body.title,
        description: request.body.description,
    });
    try {
        const saevdPost = await post.save();
        response.json(saevdPost);
    } catch(error) {
        response.json({message : error});
    }
    
});

// Delete a Post 
router.delete('/:postId', async (request, response) => {
    try {
        const removedPost = await Post.findByIdAndRemove(request.params.postId);
        response.json(removedPost);
    } catch(error) {
        response.json({message : error});
    }
});

// Update the post
router.patch('/:postId', async (request, response) => {
    try {
            const updatedPost = await Post.updateOne({ _id: request.params.postId}, 
                {$set: {title : request.body.title}});
        response.json(updatedPost);
    } catch(error) {
        response.json({message : error});
    }
});

module.exports = router;