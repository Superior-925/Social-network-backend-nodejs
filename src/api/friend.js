const { Op } = require('sequelize');
const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Friendrequest = require('../models/friend-requests');
const Userfriend = require('../models/userfriends');
const Message = require('../models/message');

const router = express.Router();

router.get('/friends/search/', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const { name } = req.query;
      const { ids } = req.query;
      User.findAll({
        where: {
          nickname: { [Op.like]: `%${name}%` },
          [Op.not]: [
            { id: ids }]
        }
      }).then((users) => {
        if (!users) return res.status(404).json({ message: 'Board not found!' });
        res.status(200).send(users);
        return null;
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.post('/friend/candidate', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { friendId, userId } = req.body;
      const friendCandidate = await Friendrequest.findOne({ where: { [Op.and]: [{ userId }, { candidateId: friendId }] } });
      if (friendCandidate) {
        return res.status(409).json({ message: 'The request already exists!' });
      }
      User.findByPk(userId)
        .then((user) => {
          if (!user) return res.status(404).json({ message: 'User not found!' });
          user.createFriendrequest({ candidateId: friendId });
          return null;
        }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
    return null;
  });

router.get('/friend/candidate/:id', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.params;

      Friendrequest.findAll({ where: { candidateId: userId.id }, include: { model: User } })
        .then((candidates) => {
          if (!candidates) return res.status(404).json({ message: 'User not found!' });
          res.status(200).send(candidates);
          return null;
        }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.post('/friend/', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { userId, candidateId } = req.body;
      Userfriend.create({ userId, friendId: candidateId }).then((friendOne) => {
        Userfriend.create({ userId: candidateId, friendId: userId }).then((friendTwo) => {
          Friendrequest.findOne({ where: { [Op.and]: [{ userId: candidateId }, { candidateId: userId }] } }).then((requestDestroy) => {
            requestDestroy.destroy();
            // console.log(requestDestroy);
            User.findByPk(candidateId)
              .then((addedFriend) => {
                res.status(200).send({ addedFriend, reqDestroy: requestDestroy });
              });
          }).catch((err) => console.log(err));
        }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.put('/friend/', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { userId, candidateId } = req.body;
      Friendrequest.findOne({ where: { [Op.and]: [{ userId: candidateId }, { candidateId: userId }] } }).then((requestDestroy) => {
        requestDestroy.destroy();
        res.status(200).send(requestDestroy);
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.get('/friends/:id', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.params;
      User.findByPk(userId.id).then((user) => {
        user.getUserfriends().then((friends) => {
          const friendsArray = [];
          friends.forEach((item) => {
            const id = item.dataValues.friendId;
            friendsArray.push(id);
          });
          User.findAll({ where: { id: friendsArray } }).then((userFriends) => {
            res.status(200).send(userFriends);
          }).catch((err) => console.log(err));
        }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.delete('/friend/', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { userId } = req.query;
      const { friendId } = req.query;

      Userfriend.findOne({ where: { [Op.and]: [{ userId }, { friendId }] } }).then((myFriend) => {
        myFriend.destroy();
        Userfriend.findOne({ where: { [Op.and]: [{ userId: friendId }, { friendId: userId }] } }).then((friend) => {
          friend.destroy();
        });
        Message.destroy({
          where: {
            [Op.and]: [{ userId }, { friendId }]
          }
        });
        Message.destroy({
          where: {
            [Op.and]: [{ userId: friendId }, { friendId: userId }]
          }
        });
        res.status(200).send(myFriend);
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

module.exports = router;
