const express = require('express');
const User = require('../src/models/user');

const router = express.Router();

router.post('/test/post', (req, res) => {
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

module.exports = router;
