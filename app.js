import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

import {
    handleEducation,
    handleRewards,
    handleTokens,
    handleAdventure,
    handleShareTg,
    handleShareDogLink,
    handleTokenPrice
} from './utiles/functions.js'
import messages from "./utiles/messages.js";
import data from "./data/management.js";
import adventureQuestions from "./static/adventureQuestions.js";

dotenv.config();

// variables -------------------------------------------------------------------
const botToken = process.env.BOT_TOKEN; // Replace with your actual bot token
const bot = new TelegramBot(botToken, { polling: true });

let currentAdventureQuestion = -1;
let selectedToken = 'eve';
// variables -------------------------------------------------------------------

// Handle '/start' command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🐾 Projects', callback_data: 'projects' }, { text: '💰 Tokens', callback_data: 'tokens' }],
                [{ text: '🗺 Adventure', callback_data: 'adventure' }, { text: '🎁 Rewards', callback_data: 'rewards' }]
            ]
        }
    }
    bot.sendMessage(chatId, messages.welcomeMessage, options);

    data.userRegister(msg.from.username);
});

// Handle Token price
bot.onText(/\/price/, async (msg) => {
    const chatId = msg.chat.id;
    handleTokenPrice(bot, chatId, selectedToken);
});
// Handle Token chart
bot.onText(/\/chart/, async (msg) => {
    const chatId = msg.chat.id;
    const chartUrl = selectedToken=='eve'?`https://www.dextools.io/app/en/dogechain/pair-explorer/0x7cdbcffa27a762fb1a951994da9524cf20f6c2f5`:`https://www.dextools.io/app/en/dogechain/pair-explorer/0x7f163d849b45a08a7a16fcac67e4a60888cb5489`;
    bot.sendMessage(chatId, chartUrl);
});
bot.onText(/\/trade/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, `Trade swiftly and securely – get the DogeGuard.dog Wallet for top-notch DogeChain transactions.`, { parse_mode: 'HTML' });
});

// Handle when a user joins the group
bot.on('new_chat_members', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.new_chat_member.id;
});

// Handle user interactions based on received messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const receivedMessage = msg.text && msg.text.toString().toLowerCase();

    if (receivedMessage === 'adventure') {
        handleAdventure(bot, msg);
    } else if (receivedMessage === 'learn') {
        handleEducation(bot, msg);
    } else if (receivedMessage === 'rewards') {
        handleRewards(bot, msg);
    } else if (receivedMessage === 'projects') {
        bot.sendMessage(chatId, messages.projectMessage, { parse_mode: 'Markdown' });
    } else if (receivedMessage === 'tokens') {
        handleTokens(bot, chatId);
    // } else if (receivedMessage === 'sharelink') {
    //     handleShareTg(bot, msg, msg.from);
    //     handleShareDogLink(bot, msg, msg.from)
    // } else if (receivedMessage === 'testchat') {
    //     bot.sendMessage(msg.from.id, `this is test private message`);
    }

    // adventure Question Answer part
    if (currentAdventureQuestion > -1) {
        const currentAdventureQuestionPptions = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Continue >>', callback_data: 'continue_adventure' },
                        { text: 'Cancel', callback_data: 'cancel_adventure' }
                    ],
                ]
            }
        }
        if (
            (currentAdventureQuestion === 0 && receivedMessage === 'c)') ||
            (currentAdventureQuestion === 1 && receivedMessage === 'd)') ||
            (currentAdventureQuestion === 2 && receivedMessage === 'true') ||
            (currentAdventureQuestion === 3 && receivedMessage === 'b)') ||
            (currentAdventureQuestion === 4 && receivedMessage === 'false') ||
            (currentAdventureQuestion === 5 && receivedMessage === 'a)') ||
            (currentAdventureQuestion === 6 && receivedMessage === 'a)') ||
            (currentAdventureQuestion === 7 && receivedMessage === 'b)') ||
            (currentAdventureQuestion === 8 && receivedMessage === 'c)')
        ) {
            bot.sendMessage(chatId, 'Congratulations! you\'ve earned 25 point', currentAdventureQuestionPptions);
            const res = await data.updateData(msg.from.username, 25);
            if (res.levelFlag && res.level == 1) {
                bot.sendMessage(chatId, messages.twoLevelAdventureWelcome, { parse_mode: 'Markdown' });
            } else if (res.levelFlag && res.level == 2) {
                bot.sendMessage(chatId, messages.threeLevelWelcome, { parse_mode: 'Markdown' });
            } else if (res.levelFlag && res.level == 3) {
                bot.sendMessage(chatId, messages.victoryLevelWelcome, { parse_mode: 'Markdown' });
            }
        } else if (
            receivedMessage != 'a)' &&
            receivedMessage != 'b)' &&
            receivedMessage != 'c)' &&
            receivedMessage != 'd)' &&
            receivedMessage != 'true' &&
            receivedMessage != 'false'
        ) {
            currentAdventureQuestion = -1;
        } else {
            bot.sendMessage(chatId, 'Wrong answer! try again to earn 25 point', currentAdventureQuestionPptions);
        }
    }
});

// Handle bot callback query
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const buttonData = callbackQuery.data;
    const user_id = callbackQuery.from.id;

    switch (buttonData) {
        case 'projects':
            bot.sendMessage(chatId, messages.projectMessage, { parse_mode: 'Markdown' });
            break;
        case 'tokens':
            handleTokens(bot, chatId);
            break;
        case 'adventure':
            handleAdventure(bot, callbackQuery.message);
            break;
        case 'continue_adventure':
            if (currentAdventureQuestion === 8) {
                currentAdventureQuestion = -1;
                bot.sendMessage(chatId, messages.howToLevelUp, { parse_mode: 'Markdown' });
            } else {
                currentAdventureQuestion += 1;
                await bot.sendMessage(user_id, adventureQuestions[currentAdventureQuestion]?.question);
            }
            break;
        case 'share_tg_link':
            handleShareTg(bot, callbackQuery.message, callbackQuery.from);
            break
        case 'share_doglink':
            handleShareDogLink(bot, callbackQuery.message, callbackQuery.from);
            break;
        case 'cancel_adventure':
            currentAdventureQuestion = -1;
            // await bot.sendMessage(chatId, `${callbackQuery.from.first_name}'s advanture was canceled`, { parse_mode: 'Markdown' });
            break;
        case 'rewards':
            handleRewards(bot, callbackQuery.message.chat.id, callbackQuery.from);
            break;
        case 'selected_eve':
            selectedToken = 'eve';
            bot.sendMessage(chatId, `🌟$EVE \n`+messages.selectedTokenMesssage);
            break;
        case 'selected_unity':
            selectedToken = 'unity';
            bot.sendMessage(chatId, `💎$UNITY \n`+messages.selectedTokenMesssage);
            break;
        default:
            break;
    }
});

// Handle errors
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

// Start the bot
console.log('Bot is running...');