require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const { htmlToText } = require('html-to-text');

// Replace with your bot token
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/test"; // Replace with your MongoDB URI

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});
  
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});
  
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

var mongoDb = mongoose.createConnection(
  (process.env.MONGODB_URI || 'mongodb://localhost:27017/test')
);
// Create models
const {
  SentimentSchema,
  SentimentsAggregateSchema,
  KeywordSchema,
  TweetSchema,
} = require("./schemas");
const Keyword = mongoose.model("Keyword", KeywordSchema);
const SentimentsAggregate = mongoDb.model(
  "SentimentsAggregate",
  SentimentsAggregateSchema
);
const Sentiment = mongoDb.model("Sentiment", SentimentSchema);
const Tweet = mongoDb.model("Tweet", TweetSchema);
// const models = { Sentiment, SentimentsAggregate, Keyword, Tweet };

// Function to fetch the next tweet that hasn't been reviewed
async function getNextTweet() {
  return await Tweet.findOne({ is_reviewed: false });
}

// Function to update the tweet classification
async function updateTweetStatus({ tweetId, hasCandidate, reviewedBy }) {
  await Tweet.findByIdAndUpdate(tweetId, {
    is_reviewed: true,
    is_candidate: hasCandidate,
    reviewed_by: reviewedBy
  });
}

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
  
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });

// Start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  // Send a message with a Web App button
  bot.sendMessage(chatId, "KOII x Truflation Hackathon App", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Launch App',
            web_app: {
              url: 'https://blurtopian.github.io/truhack_tgapp'  // Replace with your Mini App URL
            }
          }
        ]
      ]
    }
  });

  // // Fetch the next unreviewed tweet
  // const tweet = await getNextTweet();
  // if (!tweet) {
  //   bot.sendMessage(chatId, "No more tweets to review.");
  //   return;
  // }
  // try {
  //   // Display tweet content with buttons for classification
  //   const options = {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             text: "Yes, it contains a candidate",
  //             callback_data: JSON.stringify({ id: tweet._id, has_candidate: true }),
  //           },
  //           {
  //             text: "No, it doesn't",
  //             callback_data: JSON.stringify({ id: tweet._id, has_candidate: false }),
  //           },
  //         ],
  //       ],
  //     },
  //   };

  //   const cleanText = htmlToText(tweet.tweets_content);
  //   bot.sendMessage(chatId, removeLineBreaks(cleanText), options);
  // } catch (error) {
  //   console.log("error", error);
  //   next(error);
  // }
});

function stripHtml(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

function removeLineBreaks(text) {
  return text.replace(/(\r\n|\n|\r)/gm, " ");
}

// Handle button clicks
bot.on("callback_query", async (callbackQuery) => {
  console.log("callback_query", callbackQuery);
  const chatId = callbackQuery.message.chat.id;
  const data = JSON.parse(callbackQuery.data);

  const tweetId = data.id;
  const hasCandidate = data.has_candidate;
  const reviewedBy = callbackQuery.from.username;

  // Update the tweet status in the database
  await updateTweetStatus({
    tweetId,
    hasCandidate,
    reviewedBy,
  });

  // Inform the user that the tweet has been reviewed
  bot.sendMessage(
    chatId,
    `Thanks! You classified this tweet as "${
      hasCandidate ? "Contains a candidate" : "Does not contain a candidate"
    }".`
  );

  // Fetch and send the next tweet
  const nextTweet = await getNextTweet();
  console.log("nextTweet", nextTweet);
  if (nextTweet) {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Yes, it contains a candidate",
              callback_data: JSON.stringify({
                id: nextTweet._id,
                has_candidate: true,
              }),
            },
            {
              text: "No, it doesn't",
              callback_data: JSON.stringify({
                id: nextTweet._id,
                has_candidate: false,
              }),
            },
          ],
        ],
      },
    };

    const cleanText = htmlToText(nextTweet.tweets_content);
    bot.sendMessage(chatId, removeLineBreaks(cleanText), options);
  } else {
    bot.sendMessage(chatId, "No more tweets to review.");
  }
});
