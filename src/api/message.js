const express = require('express');
const passport = require('passport');
const { Op } = require('sequelize');
const Message = require('../models/message');

const router = express.Router();

router.get('/messages/', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const { userId } = req.query;
      const { friendId } = req.query;

      Message.findAll({ where: { [Op.and]: [{ userId }, { friendId }] } }).then((myMessages) => {
        if (!myMessages) return res.status(404).json({ message: 'Messages not found!' });
        Message.findAll({ where: { [Op.and]: [{ userId: friendId }, { friendId: userId }] } }).then((friendMessages) => {
          if (!friendMessages) return res.status(404).json({ message: 'Messages not found!' });
          res.status(200).send({ myMessages, friendMessages });
          return null;
        }).catch((err) => console.log(err));
        return null;
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

module.exports = router;
