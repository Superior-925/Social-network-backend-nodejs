const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
const User = require('../src/models/user');
const Post = require('../src/models/post');

const should = chai.should();

chai.use(chaiHttp);

const randomNumber = Math.floor(100000 + Math.random() * 900000);
const newEmail = `a${randomNumber}@mail.ru`;
const newNickName = `I am user ${randomNumber}`;

describe('Create/login of user', () => {
  it('it should create user', (done) => {
    const user = {
      email: newEmail,
      password: '111111',
      nickname: newNickName,
    };
    chai.request(server)
      .post('/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('userId');
        done();
      });
  });
  it('it should login of user', (done) => {
    const user = {
      email: newEmail,
      password: '111111'
    };
    chai.request(server)
      .post('/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('userId');
        done();
      });
  });
});

describe('Post api', () => {
  it('it should create post', (done) => {
    User.findOne({ where: { email: newEmail } }).then((user) => {
      const post = {
        postText: 'Some post',
        userId: user.dataValues.id
      };
      chai.request(server)
        .post('/test/post')
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('postText').eql('Some post');
          done();
        });
    });
  });
});
