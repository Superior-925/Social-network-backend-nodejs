const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

router.get('/user/info/:id', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.params;
      const userInfo = await User.findByPk(userId.id);

      if (!userInfo) return res.status(404).json({ message: 'User not found!' });

      const foundUser = { userId: userInfo.id, userNickname: userInfo.nickname, userEmail: userInfo.email };
      res.status(200).send(foundUser);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
    return null;
  });

module.exports = router;
