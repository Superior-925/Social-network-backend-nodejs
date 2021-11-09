const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const Post = sequelize.define('posts', {
  postText: {
    allowNull: false,
    unique: false,
    type: DataTypes.STRING,
    validate: {
      notNull: {
        args: true,
        msg: 'Post text is missing',
      },
      notEmpty: {
        args: true,
        msg: 'Post text is required',
      },
    },
  },
});

User.hasMany(Post, { onDelete: 'cascade' });
Post.belongsTo(User);

module.exports = Post;
