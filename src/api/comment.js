const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Comment = require('../models/comment');

const router = express.Router();

router.get('/comment/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const postId = req.params;

      Comment.findAll({ where: { postId: postId.id }, include: { model: User } }).then((comments) => {
        if (!comments) return res.status(404).json({ message: 'Comments not found!' });
        res.status(200).send(comments);
        return null;
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

module.exports = router;
