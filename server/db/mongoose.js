const mongoose = require('mongoose');

// define mongoose promise library
mongoose.Promise = global.Promise;

// connect to db
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose,
};
