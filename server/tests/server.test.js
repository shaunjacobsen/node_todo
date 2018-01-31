const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

// code to run before every test case
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      // before ending, check mongodb to make sure todo was added
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text })
          .then((todos) => {
            expect(todos.length).toBe(1);
            // expect the inserted record to have the same text as defined on line 9
            expect(todos[0].text).toBe(text);
            done();
            // next two lines: catch any errors in the test
          })
          .catch((e) => done(e));
      });
  });

  it('Should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end(done);
  });

  it('Should return 400 if object ID invalid', (done) => {
    request(app)
      .get(`/todos/094t3598`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    let fakeObjectId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${fakeObjectId}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    let hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then((res) => {
            expect(res).toNotExist();
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('Should return 404 if todo not found', (done) => {
    let fakeObjectId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${fakeObjectId}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if ID not valid', (done) => {
    request(app)
      .delete(`/todos/02jvbzcjbv345`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    let id = todos[0]._id.toHexString();
    let body = { text: 'Updated text', completed: true };

    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completed_at).toBeA('number');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then((todo) => {
            expect(todo.text).toBe(body.text);
            expect(todo.completed).toBe(true);
            expect(todo.completed_at).toBeA('number');
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('Should clear completed_at when todo is not completed', (done) => {
    let id = todos[1]._id.toHexString();
    let body = { text: 'Updated text for todo 2', completed: false };

    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(body.completed);
        expect(res.body.todo.completed_at).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then((todo) => {
            expect(todo.text).toBe(body.text);
            expect(todo.completed).toBe(body.completed);
            expect(todo.completed_at).toNotExist();
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('GET /users/me', () => {
  it('Should return a user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('Should create a new user', (done) => {
    let user = {
      email: 'shaun.d.jacobsen@gmail.com',
      password: 'testpassword',
    };

    request(app)
      .post('/users')
      .send(user)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body.email).toBe(user.email);
        expect(res.body._id).toExist();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({ email: user.email }).then((selectedUser) => {
          expect(selectedUser).toExist();
          expect(selectedUser.password).toNotBe(user.password);
          done();
        });
      });
  });

  it('Should return validation errors if request is invalid', (done) => {
    let invalidEmail = 'shaun@me';
    let shortPassword = '235g';
    request(app)
      .post('/users')
      .send({ email: invalidEmail, password: shortPassword })
      .expect(400)
      .expect((res) => {
        expect(res.body).toInclude({ errors: {} });
      })
      .end(done);
  });

  it('Should return 400 for a user whose email already exists', (done) => {
    request(app)
      .post('/users')
      .send(users[0])
      .expect(400)
      .end(done);
  });
});
