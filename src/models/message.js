const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const Message = sequelize.define('message', {
  messageText: {
    allowNull: false,
    unique: false,
    type: DataTypes.STRING,
    validate: {
      notNull: {
        args: true,
        msg: 'Message text is missing',
      },
      notEmpty: {
        args: true,
        msg: 'Message text is required',
      },
    },
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  friendId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

User.hasMany(Message);
Message.belongsTo(User);

module.exports = Message;
