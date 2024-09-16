const mongoose = require('mongoose');
const { Schema } = mongoose;

const TweetSchema = new Schema({
  value: {
    type: String,
    trim: true,
    required: true,
  },
  user_name: {
    type: String,
    trim: true,
    required: true,
  },
  screen_name: {
    type: String,
    trim: true,
  },
  user_url: {
    type: String,
    trim: true,
  },
  user_img: {
    type: String,
    trim: true,
  },
  tweets_id: {
    type: String,
    trim: true,
  },
  tweets_content: {
    type: String,
  },
  time_post: {
    type: Date,
  },
  time_read: {
    type: Date,
  },
  comment: {
    type: Number
  },
  like: {
    type: Number
  },
  share: {
    type: Number
  },
  view: {
    type: Number
  },
  outer_media_url: {
    type: [String]
  },
  outer_media_short_url: {
    type: [String]
  },
  keyword: {
    type: String
  },
  hash: {
    type: String
  },
  is_reviewed: {
    type: Boolean,
    default: false
  },
  has_candidate: {
    type: Boolean,
    default: false
  },
  candidates: {
    type: [String]
  },
});

module.exports = { TweetSchema };