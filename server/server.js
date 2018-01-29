require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

// database/models
let { ObjectID } = require('mongodb');
let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

const app = express();

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

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  // the body contains the data we want to update
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completed_at = new Date().getTime();
  } else {
    body.completed = false;
    body.completed_at = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((e) => {
      res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch((e) => {
      console.log(e);
    });
});

app.listen(process.env.PORT, () =>
  console.log(`Server up on ${process.env.PORT}`)
);

module.exports = { app };
