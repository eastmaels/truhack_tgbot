const { SentimentSchema } = require('./sentiment');
const { SentimentsAggregateSchema } = require('./sentiments_aggregate');
const { KeywordSchema } = require('./keyword');
const { TweetSchema } = require('./tweet');

module.exports = {
  SentimentSchema,
  SentimentsAggregateSchema,
  KeywordSchema,
  TweetSchema,
};