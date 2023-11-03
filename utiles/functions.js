import riddles from "../static/riddles.js";
import data from "../data/management.js";
import messages from "../utiles/messages.js";

// Function to handle the treasure hunt interaction
function handleTreasureHunt(bot, msg) {
    
}

// Function to handle the education module
function handleEducation(bot, msg) {
    const chatId = msg.chat.id;
    const educationMessage = `
    Learn about our projects:

    1. [Eden.dog](https://yourprojecturl.com/eden): A platform for community exploration and growth.
    2. [DogeGuard.dog](https://yourprojecturl.com/guard): Ensuring safety and security for all community members.
    3. [DogeLoveStory.dog](https://yourprojecturl.com/love): A heartwarming journey of love in the crypto world.
    `;
    bot.sendMessage(chatId, educationMessage, { parse_mode: 'Markdown' });
}

// Function to handle the rewards system
async function handleRewards(bot, msg) {
    const chatId = msg.chat.id;

    // Prepare the rewards message dynamically
    const db = await data.getData();
    const points = db[msg.from.username].point; // Replace with actual user points
    const level = db[msg.from.username].level;
    const engagementLevel = level==0?"Paw-tector":level==1?"Barkitect":level==2?'Guardians':"Guardian's Ultimate Triumph"; // Replace with actual user engagement level

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
                [{ text: 'Continue Adventure >>', callback_data: 'continue_adventure' }],
            ]
        }
    }
    await bot.sendMessage(chatId, messages.adventureMessage, options);
}
// Handle Tokens
const handleTokens = async (bot, chatId) => {
    await bot.sendMessage(chatId, messages.tokenMessage, { parse_mode: 'Markdown' });
    await bot.sendMessage(chatId, messages.eveTokenAddress, { parse_mode: 'Markdown' });
    await bot.sendMessage(chatId, messages.unityTokenAddress, { parse_mode: 'Markdown' });
    await bot.sendMessage(chatId, messages.dogechainRouter, { parse_mode: 'HTML' });
}

// Export the functions to be used in other scripts
export {
    handleTreasureHunt,
    handleEducation,
    handleRewards,
    handleTokens,
    handleAdventure
};
