const express = require('express');
const registerApi = require('./registration');
const loginApi = require('./login');
const postApi = require('./post');
const userApi = require('./user');
const friendsApi = require('./friend');
const messageApi = require('./message');
const commentsApi = require('./comment');
const test = require('../../test/test');

const router = express.Router();

router.use(registerApi);
router.use(loginApi);
router.use(postApi);
router.use(userApi);
router.use(friendsApi);
router.use(messageApi);
router.use(commentsApi);
router.use(test);

module.exports = router;
