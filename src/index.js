const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const passport = require('passport');
const Message = require('./models/message');
const Comment = require('./models/comment');
const Userfriends = require('./models/userfriends');
const User = require('./models/user');

require('./models/user');
require('./models/refresh-token');

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

require('./auth/passport')(passport);
require('./database/index');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

const wrapMiddlewareForSocketIo = (middleware) => (socket, next) => middleware(socket.request, {}, next);
io.use(wrapMiddlewareForSocketIo(passport.initialize()));
io.use(wrapMiddlewareForSocketIo(passport.authenticate('jwt', { session: false })));

const socketsArray = [];

io.on('connection', (socket) => {
  for (let i = 0; i < socketsArray.length; i++) {
    if (socketsArray[i].userId === socket.handshake.query.userId) {
      socketsArray.splice(i, 1);
    }
  }

  const newSocket = {
    userId: socket.handshake.query.userId,
    userSocket: socket.id
  };
  socketsArray.push(newSocket);

  socket.on('message', (message) => {
    const friendSocketId = socketsArray.find((item) => +item.userId === +message.friendId);
    Message.create({
      messageText: message.messageText,
      userId: message.userId,
      friendId: message.friendId
    }).then((newMessage) => {
      socket.emit('message', newMessage);
      if (friendSocketId) {
        socket.to(friendSocketId.userSocket).emit('message', newMessage);
      }
    }).catch((err) => console.log(err));
  });
  socket.on('comment', (comment) => {
    Comment.create({
      commentText: comment.commentText,
      postId: comment.postId,
      userId: comment.userId
    }).then((newComment) => {
      Comment.findByPk(newComment.dataValues.id, { include: { model: User } }).then((foundComment) => {
        socket.emit('comment', foundComment);
        Userfriends.findAll({ where: { userId: comment.userId } }).then((friends) => {
          friends.forEach((friend) => {
            socketsArray.forEach((userSocket) => {
              if (+friend.dataValues.friendId === +userSocket.userId) {
                socket.to(userSocket.userSocket).emit('comment', foundComment);
              }
            });
          });
        }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
  });
  socket.on('comment-change', (comment) => {
    Comment.findByPk(comment.commentId).then((changeComment) => {
      changeComment.commentText = comment.commentText;
      changeComment.save();
      Userfriends.findAll({ where: { userId: comment.userId } }).then((friends) => {
        friends.forEach((friend) => {
          socketsArray.forEach((userSocket) => {
            if (+friend.dataValues.friendId === +userSocket.userId) {
              socket.to(userSocket.userSocket).emit('comment-change', changeComment);
            }
          });
        });
      }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
  });
});

app.use(passport.initialize());

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Success!'
  });
});

app.use('/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});

module.exports = app;
