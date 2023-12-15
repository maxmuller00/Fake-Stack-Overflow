// Answer Document Schema
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let AnswerSchema = new Schema(
    {
        text : {type: String , required: true},
        ans_by :  { type: Schema.Types.ObjectId, ref: 'User', required: true},
        ans_by_name: {type: String},
        ans_date_time : {type: Date , default: Date.now},
        votes: {type: Number , default: 0},
        comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
        qid: { type: Schema.Types.ObjectId, ref: 'Question' },
        voters: [{
          userVoted: { type: Schema.Types.ObjectId, ref: 'User'},
          amount: { type: Number, default: 0},
        }]
    }
);

// Virtual for Answer's URL
AnswerSchema
.virtual('url')
.get(function () {
  return 'posts/answer/_id/' + this._id;
});

//Export model
module.exports = mongoose.model('Answer', AnswerSchema);
