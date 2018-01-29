const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const testTodos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completed_at: 333,
  },
];

// code to run before every test case
beforeEach((done) => {
  Todo.remove({})
    .then(() => {
      Todo.insertMany(testTodos);
    })
    .then(() => done());
});

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
      .get(`/todos/${testTodos[1]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(testTodos[1].text);
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
    let hexId = testTodos[0]._id.toHexString();

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
    let id = testTodos[0]._id.toHexString();
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
    let id = testTodos[1]._id.toHexString();
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
