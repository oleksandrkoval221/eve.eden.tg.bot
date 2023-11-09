import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import data from "../data/management.js";
import messages from "../utiles/messages.js";

// Function to handle the education module
function handleEducation(bot, msg) {
    const chatId = msg.chat.id;
    const educationMessage = `
    Learn about our projects:

    1. [Eden.dog](https://eden.dog.dog/): A platform for community exploration and growth.
    2. [DogeGuard.dog](https://dogeguard.dog): Ensuring safety and security for all community members.
    3. [DogeLoveStory.dog](https://dogelovestory.dog): A heartwarming journey of love in the crypto world.
    3. [BuildaDoge.dog](https://buildadoge.dog): Advanced token creation for the biggest of ideas.
    `;
    bot.sendMessage(chatId, educationMessage, { parse_mode: 'Markdown' });
}

// Function to handle the rewards system
async function handleRewards(bot, chatId, user) {
    // Prepare the rewards message dynamically
    const db = await data.getData();
    if (!user) return; 
    const points = db[user?.username].point; // Replace with actual user points
    const level = db[user?.username].level;
    const engagementLevel = level == 0 ? "Paw-tector" : level == 1 ? "Barkitect" : level == 2 ? 'Guardians' : "Guardian's Ultimate Triumph"; // Replace with actual user engagement level

    const rewardsMessage = `
    Your Rewards and Privileges:

    - Current Points: ${points}
    - Engagement Level: ${engagementLevel}
    - Privileges: Access to exclusive community events, NFT drops, and more!
    - Reach 500 points to unlock VIP status with even greater benefits!
    - As a ${engagementLevel}, you're contributing to the unity of our community. #muchlove 🐾
    `;

    bot.sendMessage(chatId, rewardsMessage, { parse_mode: 'Markdown' });
}

// Handle adventure
const handleAdventure = async (bot, msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📢 SHARE UNITY', callback_data: 'share_tg_link' },
                    { text: '🔑 DOGEGUARD.DOG', callback_data: 'share_doglink' },
                ],
				[{ text: 'Continue Adventure >>', callback_data: 'continue_adventure' }],
                ]
        }
    }
    await bot.sendMessage(chatId, messages.adventureMessage, options);
    await bot.sendMessage(chatId, `💬 Check your DMs it will become your portal to our adventure! 🌕✨`);
}
// Handle Tokens
const handleTokens = async (bot, chatId) => {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🌟$EVE', callback_data: 'selected_eve' },
                    { text: '💎$UNITY', callback_data: 'selected_unity' }
                ],
            ]
        }
    }
    await bot.sendMessage(chatId, messages.tokenMessage, options);
    await bot.sendMessage(chatId, messages.dogechainRouter, { parse_mode: 'HTML' });
}

// 
const handleTokenPrice = (bot, chatId, selectedToken) => {
    const url = 'https://api.dextools.io/v1/token';
    const apiKey = process.env.DEXTOOL_KEY;
    const chain = 'dogechain';
    const address = selectedToken=='eve'?'0x70ace47d53a8a2c8bfb6b4e5755291570d2449a3':'0x216778953ea29a5d04f191810fc444b4caf17d7b';

    axios.get(url, {
        params: {
            chain: chain,
            address: address
        },
        headers: {
            'accept': 'application/json',
            'X-API-Key': apiKey
        }
    })
        .then(response => {
            const { data } = response.data;
            const price = data.reprPair.price;
            bot.sendMessage(chatId, `The current price of ${data.name} on Dextools.io is ${price}`, { parse_mode: 'Markdown' });
        })
        .catch(error => {
            console.error(error);
        });
}

const handleShareTg = (bot, msg, user) => {
    const chatId = msg.chat.id;
    bot.exportChatInviteLink(chatId).then((inviteLink) => {
        bot.sendMessage(chatId, `
        Here is the invite link for this group: ${inviteLink}
        Share this invite because it is no fun to play alone.
        `);
        data.updateData(user.username, 50);
    }).catch((error) => {
        bot.sendMessage(chatId, `Failed to create invite link. Error: ${error}`);
    });
}

const handleShareDogLink = (bot, msg, user) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `https://dogeguard.dog/`);
    data.updateData(user.username, 50);
}

// Export the functions to be used in other scripts
export {
    handleEducation,
    handleRewards,
    handleTokens,
    handleAdventure,
    handleTokenPrice,
    handleShareDogLink,
    handleShareTg
};
