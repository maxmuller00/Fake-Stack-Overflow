// Question Document Schema
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let QuestionSchema = new Schema({
  title: { type: String, maxLength: 50, required: true },
  summary: { type: String, maxLength: 140, required: true },
  text: { type: String, required: true },
  tags: {
    type: [Schema.Types.ObjectId],
    ref: 'Tag',
    required: true,
  },
  answers: { type: [Schema.Types.ObjectId], ref: 'Answer' },
  asked_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  asked_by_name: {type: String},
  ask_date_time: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
  voters: [{
    userVoted: { type: Schema.Types.ObjectId, ref: 'User'},
    direction: { type: Number, default: 0},
  }]
});

// Virtual for Answer's URL
QuestionSchema.virtual('url').get(function () {
  return 'posts/question/_id/' + this._id;
});

//Export model
module.exports = mongoose.model('Question', QuestionSchema);
