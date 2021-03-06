const mongoose = require('mongoose');

// create model
let Todo = mongoose.model('Todo', {
  text: { type: String, required: true, minlength: 1, trim: true },
  completed: { type: Boolean, default: false },
  completed_at: { type: Number, default: null },
  _creator: { required: true, type: mongoose.Schema.Types.ObjectId },
});

module.exports = {
  Todo,
};
