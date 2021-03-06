const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/users', (req, res) => {
  Post.find({})
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(422).json({ error: 'Cannot find users' });
    });
});

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .then((question) => {
      const newID = question.acceptedAnswerID;
      Post.findOne({ soID: newID })
        .then((answer) => {
          res.status(200).json(answer);
        })
        .catch((error) => {
          res.status(422).json({ error: 'No answer found' });
        });
    })
    .catch((error) => {
      res.status(422).json({ error: 'No question found' });
    });
});

// top answer
server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  const questionPost = Post.find({ soID });
  Post.find({ parentID: soID })
    .where('soID').ne(questionPost.acceptedAnswerID)
    .sort({ score: 'asc' })
    .then((posts) => {
      res.status(200).json(posts[0]);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
});

// GET popular jquery questions
server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ parentID: null, tags: 'jquery', $or: [{ score: { $gt: 5000 } }, { 'user.repuation': { $gt: 200000 } }] })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(422).json(error);
    });
});

// GET npm-answers
server.get('/npm-answers', (req, res) => {
  Post.find({ parentID: null, tags: 'npm' })
    .then((npmQuestions) => {
      Post.find()
        .where('parentID').in(npmQuestions.map(question) => question.soID))
        .exec()
        .then((answers) => {
          res.status(200).json(answers);
        })
        .catch((error) => {
          res.status(422).json(error);
        });
    })
});

module.exports = { server };
