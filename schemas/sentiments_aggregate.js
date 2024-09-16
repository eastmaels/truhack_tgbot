const mongoose = require('mongoose');
const { Schema } = mongoose;

const SentimentsAggregateSchema = new Schema({
  sentiment_type: {
    type: String,
    trim: true,
    required: true,
  },
  total_sentiments: {
    type: Number,
    required: true,
  },
  total_positive: {
    type: Number,
    required: true,
  },
  total_negative: {
    type: Number,
    required: true,
  },
}, {
  collection: 'sentiments_aggregate'
});

module.exports = { SentimentsAggregateSchema };