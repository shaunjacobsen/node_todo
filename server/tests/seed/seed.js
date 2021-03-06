const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId,
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completed_at: 333,
    _creator: userTwoId,
  },
];

const users = [
  {
    _id: userOneId,
    email: 'test@email.com',
    password: 'userOnePassword',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET)
          .toString(),
      },
    ],
  },
  {
    _id: userTwoId,
    email: 'sample@email.com',
    password: 'us3rTwoPassw0rd',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET)
          .toString(),
      },
    ],
  },
];

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      Todo.insertMany(todos);
    })
    .then(() => done());
};

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      let userOne = new User(users[0]).save();
      let userTwo = new User(users[1]).save();

      // not called until all promises listed are resolved
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = { todos, users, populateTodos, populateUsers };
