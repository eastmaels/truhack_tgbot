const mongoose = require('mongoose');
const { Schema } = mongoose;

const SentimentSchema = new Schema({
  type: {
    type: String,
    trim: true,
    required: true,
  },
  positive: {
    type: Number,
  },
  negative: {
    type: Number,
  },
  sentiment: {
    type: Number,
  },
  user: {
    type: String,
    trim: true,
  },
});

module.exports = { SentimentSchema };