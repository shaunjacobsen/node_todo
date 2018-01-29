const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Could not connect to database.');
  }
  console.log('Connected to MongoDB');

  // db
  //   .collection('Todos')
  //   .findOneAndUpdate(
  //     { name: 'Eat lunch' },
  //     { $set: { completed: true } },
  //     { returnOriginal: false }
  //   )
  //   .then((result) => console.log(result));

  db
    .collection('Users')
    .findOneAndUpdate(
      { name: 'Rodney' },
      { $set: { name: 'Shaun' }, $inc: { age: 1 } },
      { returnOriginal: false }
    )
    .then((result) => console.log(result));

  //db.close();
});
