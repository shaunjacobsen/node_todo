const mongoose = require('mongoose');

// define mongoose promise library
mongoose.Promise = global.Promise;

// connect to db
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose,
};
