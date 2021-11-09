const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const Post = require('./post');

const Comment = sequelize.define('comment', {
  commentText: {
    allowNull: false,
    unique: false,
    type: DataTypes.STRING,
    validate: {
      notNull: {
        args: true,
        msg: 'Comment text is missing',
      },
      notEmpty: {
        args: true,
        msg: 'Comment text is required',
      },
    },
  },
});

User.hasMany(Comment, { onDelete: 'cascade' });
Comment.belongsTo(User);

Post.hasMany(Comment, { onDelete: 'cascade' });
Comment.belongsTo(Post);

module.exports = Comment;
