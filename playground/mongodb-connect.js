const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Could not connect to database.');
  }
  console.log('Connected to MongoDB');

  // db.collection('Todos').insertOne(
  //   {
  //     text: 'Make dinner',
  //     completed: false,
  //   },
  //   (err, result) => {
  //     if (err) {
  //       return console.log('Cannot insert new todo', err);
  //     }
  //
  //     console.log(JSON.stringify(result.ops));
  //   }
  // );

  db
    .collection('Users')
    .insertOne(
      { name: 'Shaun', age: 27, location: 'Chicago' },
      (err, result) => {
        if (err) {
          return console.log('Cannot insert new user', err);
        }
        console.log(result.ops[0]._id.getTimestamp());
      }
    );

  db.close();
});
