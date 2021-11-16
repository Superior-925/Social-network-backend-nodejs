const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');

const router = express.Router();

router.post('/post', passport.authenticate('jwt', { session: false }),

  (req, res) => {
    try {
      const {
        postText, userId
      } = req.body;
      User.findByPk(userId).then((user) => {
        if (!user) return res.status(404).json({ message: 'User not found!' });
        user.createPost({ postText }).then((post) => {
          res.status(200).send(post);
        }).catch((err) => console.log(err));
        return null;
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.get('/post/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const userId = req.params;

      User.findByPk(userId.id).then((user) => {
        if (!user) return res.status(404).json({ message: 'Board not found!' });
        user.getPosts()
          .then((posts) => {
            res.status(200).send(posts);
          })
          .catch((err) => console.log(err));
        return null;
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.delete('/post/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const postId = req.params;
      Post.findByPk(postId.id).then((post) => {
        if (!post) return res.status(404).json({ message: 'Post not found!' });
        post.destroy();
        const resJson = JSON.stringify(post.dataValues.id);
        res.send(resJson);
        return null;
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.put('/post/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const postText = req.body;
      const postId = req.params;

      Post.findByPk(postId.id).then((post) => {
        if (!post) return res.status(404).json({ message: 'Post not found!' });
        post.postText = postText.postText;
        post.save();
        res.status(200).send(post);
        return null;
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

module.exports = router;
