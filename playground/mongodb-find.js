const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Could not connect to database.');
  }
  console.log('Connected to MongoDB');

  db
    .collection('Users')
    .find({ name: 'Bean' })
    .toArray()
    .then(
      (documents) => {
        console.log('Users:', documents);
      },
      (err) => {
        console.log('Unable to fetch todos', err);
      }
    );

  //db.close();
});
