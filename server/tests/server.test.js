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
