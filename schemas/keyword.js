const mongoose = require('mongoose');
const { Schema } = mongoose;

const KeywordSchema = new Schema({
  value: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = { KeywordSchema };