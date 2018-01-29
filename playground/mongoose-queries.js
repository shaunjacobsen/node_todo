const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

let id = '6a6f674d11bdfc383294f0ea1';

if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

// Todo.find({
//   _id: id,
// }).then((todos) => console.log('Todos', todos));
//
// Todo.findOne({
//   _id: id,
// }).then((todo) => console.log('Todos', todo));

Todo.findById(id)
  .then((todo) => {
    if (!todo) {
      return console.log('ID not found');
    }
    console.log('Todos', todo);
  })
  .catch((e) => console.log(e));
