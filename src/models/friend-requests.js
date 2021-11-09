const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const Friendrequest = sequelize.define('friendrequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  candidateId: {
    type: DataTypes.INTEGER,
  }
});

User.hasMany(Friendrequest);
Friendrequest.belongsTo(User);

module.exports = Friendrequest;
