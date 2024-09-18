const TelegramBot = require('node-telegram-bot-api');

// Initialize the bot with webhook support
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// Export the webhook handler
export default async function handler(req, res) {
  // Handle incoming webhook POST requests
  if (req.method === 'POST') {
    bot.processUpdate(req.body); // Process the Telegram update
    res.status(200).send('OK');
  } else {
    res.status(200).send('This endpoint is for Telegram bot webhooks');
  }
}