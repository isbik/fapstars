require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true, testEnvironment: true });

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
    if (msg.from.is_bot) return

    const query = match[1];
    let referrer // username прользователя
    if (query && query.startsWith('ref')) {
        referrer = query.slice(3)
        console.log('REFERRER =>', referrer);
    }

    handleStartMsg(msg.chat.id, referrer)
});

const handleStartMsg = (chatId, referrer = null) => {
    let greetingMessage = 'Hello, I am a FapStars bot!'
    if (referrer) {
        greetingMessage += ` You are invited by [${referrer}](https://t.me/${referrer})`
    }

    const webAppUrl = referrer ? `${process.env.WEB_APP_URL}?referrer=${referrer}` : `${process.env.WEB_APP_URL}`

    bot.sendMessage(chatId, greetingMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Open app', web_app: { url: webAppUrl } }]
            ]
        },
        parse_mode: 'Markdown'
    });
} 