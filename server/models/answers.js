// Answer Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const AnswerSchema = new mongoose.Schema({
  text: {type : String, default : "default Text"},
  ans_by: {type : String, default : "Anonymous"},
  ans_date_time: {type: Date, default: Date.now},
});

AnswerSchema
.virtual('url')
.get(function () {
  return 'posts/answer/_id/' + this._id;
});


module.exports = mongoose.model('Answer', AnswerSchema);

