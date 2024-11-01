const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userr: { type: String, required: true },
  uemail: { type: String, required: true },
  ucomment: { type: String, required: true }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
