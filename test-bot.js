const TelegramBot = require('node-telegram-bot-api');

// Hardcoded token for testing purposes
const token = '8583053385:AAHA4czA1x0Lb66kfwt6xLJBJxhmCJkj-xU';

console.log('Testing token:', token);

const bot = new TelegramBot(token, { polling: true });

// Just try to get bot info
bot.getMe().then((me) => {
  console.log('SUCCESS! Bot connected.');
  console.log('Bot Name:', me.first_name);
  console.log('Bot Username:', me.username);
}).catch((err) => {
  console.error('FAILED to connect.');
  console.error('Error code:', err.code);
  console.error('Error message:', err.message);
  process.exit(1);
});

bot.on('message', (msg) => {
  console.log('Received message:', msg.text);
  bot.sendMessage(msg.chat.id, 'Hello! I am alive.');
});
