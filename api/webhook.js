const TelegramBot = require("node-telegram-bot-api");

// Replace with your bot token
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

// Export the webhook handler
export default async function handler(req, res) {
  console.log('Webhook called');
  // Handle incoming webhook POST requests
  if (req.method === 'POST') {
    console.log('Webhook called... POST');
    bot.processUpdate(req.body); // Process the Telegram update
    res.status(200).send('OK');
  } else {
    res.status(200).send('This endpoint is for Telegram bot webhooks');
  }
}

// Start command
bot.onText(/\/start/, async (msg) => {
  console.log('start called');
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

});
