// Tag Document Schema
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TagSchema = new Schema(
    {
        name : {type: String , unique: true, required: true},
        created_By : { type: Schema.Types.ObjectId, ref: 'User', required: true},
        created_by_name: {type: String},
        numQ : {type : Number, default : 0},
    }
);

// Virtual for Answer's URL
TagSchema
.virtual('url')
.get(function () {
  return 'posts/tag/_id/' + this._id;
});

//Export model
module.exports = mongoose.model('Tag', TagSchema);

