const express = require('express');
const bodyParser = require('body-parser');

// database/models
let { ObjectID } = require('mongodb');
let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text,
  });
  todo.save().then(
    (doc) => {
      res.send(doc);
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

app.get('/todos', (req, res) => {
  Todo.find().then(
    (todos) => {
      res.send({ todos });
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
    .then(
      (todo) => {
        if (!todo) {
          return res.send(404);
        }
        res.send({ todo });
      },
      (err) => {
        res.status(400).send({});
      }
    )
    .catch((e) => {
      res.status(400).send();
    });
});

app.listen(port, () => console.log(`Server up on ${port}`));

module.exports = { app };
