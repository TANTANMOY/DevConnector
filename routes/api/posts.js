const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


//Post model
const Post = require('../../models/Post');


//Profile model
const Profile = require('../../models/Profile');


//validation
const validatePostInput = require('../../validation/post');


// @route GET api/posts/test
// @desc Tests post route
// @access public

router.get('/test', (req, res) => res.json({
    msg: "Posts works"
}));
// @route GET api/posts
// @desc  GET Post
// @access public


router.get('/', (req, res) => {
    Post.find()
        .sort({
            date: -1
        })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostsfound: 'No posts found '
        }));
});

// @route GET api/posts/:id
// @desc  GET Post by id
// @access public


router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
            nopostfound: 'No post found with that Id'
        }));
});



// @route POST api/posts
// @desc  Create Post
// @access private

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
        //if any errors, send 400 with errors object
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post));
});

// @route DELETE api/posts/:id
// @desc  Delete Post
// @access private

router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({
                            notauthorized: 'User not authorized'
                        });
                    }
                    // Delete
                    post.remove().then(() => res.json({
                        success: true
                    }));
                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }));
        })
});

// @route POST api/posts/like/:id
// @desc   Post like
// @access private

router.post('/like/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({
                            alreadyliked: 'User already liked this post'
                        });
                    }
                    //add user id to likes array
                    post.likes.unshift({
                        user: req.user.id
                    });
                    post.save().then(post => res.json(post))

                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }));
        })
});


// @route POST api/posts/unlike/:id
// @desc   unlike post
// @access private

router.post('/unlike/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({
                            notliked: 'You have not yet liked this post'
                        });
                    }
                    //Get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    //splice pot of array
                    post.likes.splice(removeIndex, 1);

                    //save
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }));
        })
});


// @route POST api/posts/comment/:id
// @desc  add comment to post
// @access private

router.post('/comment/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {
        errors,
        isValid
    } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
        //if any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            //Add to comment array
            post.comments.unshift(newComment);

            //save
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({
            postnotfound: 'No post found'
        }));
});



// @route POST api/posts/comment/:id/:comment_id
// @desc  Remove comment from post
// @access private

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {


    Post.findById(req.params.id)
        .then(post => {
            //check to see if comment exists
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({
                    commentnotexists: 'comment does not exists'
                });
            }

            //Get remove index

            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);

            //splice comment out of array

            post.comments.splice(removeIndex, 1);

            //save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
            postnotfound: 'No post found'
        }));
});
module.exports = router;