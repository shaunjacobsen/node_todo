const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Could not connect to database.');
  }
  console.log('Connected to MongoDB');

  // db
  //   .collection('Users')
  //   .deleteMany({ name: 'Shaun' })
  //   .then((result) => {
  //     console.log('Result:', result);
  //   });

  // db
  //   .collection('Todos')
  //   .deleteOne({ name: 'Eat lunch' })
  //   .then((result) => {
  //     console.log(result);
  //   });

  // db
  //   .collection('Users')
  //   .findOneAndDelete({ _id: new ObjectID('5a6e49a14acc5d1dc75720c7') })
  //   .then((result) => console.log(result));

  //db.close();
});
