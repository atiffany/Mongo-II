const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

const PostSchema = new Schema({
  // TODO: write your schema here
  // required: soID, url, body, score
  // others: parentID, title, tags, acceptedAnswerID, user[soUserId, name, reputation],
  // tags is an array of strings
  // user is a nested object
  soID: {
    required: true,
    type: Number,
  },
  parentID: {
    type: Number,
  },
  url: {
    required: true,
    type: String,
  },
  title: {
    type: String,
  },
  body: {
    required: true,
    type: String,
  },
  score: {
    required: true,
    type: Number,
  },
  tags: [],
  acceptedAnswerID: {
    type: Number,
  },
  user: {
    soUserID: {
      type: Number,
    },
    name: {
      type: String,
    },
    reputation: {
      type: Number,
    }
  }
});

module.exports = mongoose.model('Posts', PostSchema);
