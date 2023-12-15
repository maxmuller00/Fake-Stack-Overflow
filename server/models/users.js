let mongoose = require('mongoose');

let Schema = mongoose.Schema

let UserSchema = new Schema( {
    username: {type: String, default: "Anonymous"},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    created_at: {type: Date, default: new Date},
    tags: { type: [Schema.Types.ObjectId], ref: 'Tag' },
    answers: { type: [Schema.Types.ObjectId], ref: 'Answer' },
    questions: { type: [Schema.Types.ObjectId], ref: 'Question' },
    reputation: {type: Number, default: 50}
    
});

UserSchema
.virtual('url')
.get(function() {
    return 'users/_id' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
