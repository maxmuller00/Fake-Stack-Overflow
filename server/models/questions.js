// Question Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const QuestionSchema = new mongoose.Schema({
  title : {type: String , maxLength: 100, required: true},
  text : {type: String , required: true},
  tags : {type: [Schema.Types.ObjectId], ref : "Tag", required: true, validate: v => Array.isArray(v) && v.length > 0}, 
  asked_by : {type: String, default: "Anonymous"},
  ask_date_time: {type: Date, default: Date.now},
  answers : {type: [Schema.Types.ObjectId], ref : "Answer"},
  views: {type: Number, default : 0},
});

QuestionSchema
.virtual('url')
.get(function () {
  return 'posts/question/_id/' + this._id;
});


module.exports = mongoose.model('Question', QuestionSchema);



