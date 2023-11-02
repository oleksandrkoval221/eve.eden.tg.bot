import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import {
    handleTreasureHunt,
    handleEducation,
    handleRewards
} from './utiles/functions.js'

import messages from "./utiles/messages.js";
import data from "./data/management.js";
import adventureQuestions from "./static/adventureQuestions.js";

dotenv.config();

// variables -------------------------------------------------------------------
const botToken = process.env.BOT_TOKEN; // Replace with your actual bot token
const bot = new TelegramBot(botToken, { polling: true });

let currentAdventureQuestion = -1;
// variables -------------------------------------------------------------------

// Handle '/start' command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Projects', callback_data: 'projects' }, { text: 'Tokens', callback_data: 'tokens' }],
                [{ text: 'Adventure', callback_data: 'adventure' }, { text: 'Rewards', callback_data: 'rewards' }]
            ]
        }
    }
    bot.sendMessage(chatId, messages.welcomeMessage, options);

    data.userRegister(msg.chat.username);
});


// Handle user interactions based on received messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const receivedMessage = msg.text.toString().toLowerCase();

    if (receivedMessage === 'treasure hunt') {
        handleTreasureHunt(bot, msg);
    } else if (receivedMessage === 'learn') {
        handleEducation(bot, msg);
    } else if (receivedMessage === 'rewards') {
        handleRewards(bot, msg);
    }

    // adventure Question Answer part
    if(currentAdventureQuestion > -1) {
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
        if( 
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
            data.updateData(msg.chat.username, 25);
            bot.sendMessage(chatId, 'Correct! you\'ve got 25 point', currentAdventureQuestionPptions);
        } else {
            bot.sendMessage(chatId, 'Wrong answer! try again to get 25 point', currentAdventureQuestionPptions);
        }
    }
});

// Handle bot callback query
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const buttonData = callbackQuery.data;

    switch (buttonData) {
        case 'projects':
            bot.sendMessage(chatId, messages.projectMessage, { parse_mode: 'Markdown' });
            break;
        case 'tokens':
            await bot.sendMessage(chatId, messages.tokenMessage, { parse_mode: 'Markdown' });
            await bot.sendMessage(chatId, messages.eveTokenAddress, { parse_mode: 'Markdown' });
            await bot.sendMessage(chatId, messages.unityTokenAddress, { parse_mode: 'Markdown' });
            await bot.sendMessage(chatId, messages.dogechainRouter, { parse_mode: 'HTML' });
            break;
        case 'adventure':
            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Continue Adventure >>', callback_data: 'continue_adventure' }],
                    ]
                }
            }
            await bot.sendMessage(chatId, messages.adventureMessage, options);
            break;
        case 'continue_adventure':
            if(currentAdventureQuestion === 8) {
                currentAdventureQuestion = -1;
                const message = `Sharing Telegram Invite Link: Earn 50 points for each successful share for Telegram invite link and X. (100 points)`;
                bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            } else {
                currentAdventureQuestion += 1;
                await bot.sendMessage(chatId, adventureQuestions[currentAdventureQuestion]?.question, { parse_mode: 'Markdown' });
            }
            break;
        case 'cancel_adventure':
            currentAdventureQuestion = -1;
            await bot.sendMessage(chatId, 'Canceled', { parse_mode: 'Markdown' });
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