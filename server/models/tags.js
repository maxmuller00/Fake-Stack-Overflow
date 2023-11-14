// Tag Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const TagSchema = new mongoose.Schema({
  name: {type : String, default : "defaultName"},
  numQ : {type : Number, default : 0},
});

TagSchema
.virtual('url')
.get(function () {
  return 'posts/tag/_id/' + this._id;
});


module.exports = mongoose.model('Tag', TagSchema);
