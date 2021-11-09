const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const Userfriend = sequelize.define('userfriend', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  friendId: {
    type: DataTypes.INTEGER,
  }
});

User.hasMany(Userfriend);
Userfriend.belongsTo(User);

module.exports = Userfriend;
