const express = require('express');
const mongoose = require('mongoose');

const fs = require('fs');

let savedPosts = null;

const Post = require('./post.js');

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

const populatePosts = () => {
  // TODO: implement this
  const allPosts = readPosts();
  const promises = allPosts.map(post => new Post(post).save());
  return Promise.all(promises);
};

populatePosts();


module.exports = { readPosts, populatePosts };
