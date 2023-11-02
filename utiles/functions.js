import riddles from "../static/riddles.js";

// Function to handle the treasure hunt interaction
function handleTreasureHunt(bot, msg) {
    const chatId = msg.chat.id;
    // Read the clues from the JSON file
    sendClue(bot, chatId, riddles, 0);
}

// Function to send the clue and link to the user
function sendClue(bot, chatId, clues, index) {
    if (index < clues.length) {
        const clueMessage = clues[index].clue + "\n\n" + "🔗 " + clues[index].link;
        bot.sendMessage(chatId, clueMessage, { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, "Congratulations! You've completed the treasure hunt. 🎉");
    }
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
function handleRewards(bot, msg) {
    const chatId = msg.chat.id;

    // Prepare the rewards message dynamically
    const points = getUserPoints(msg); // Replace with actual user points
    const engagementLevel = getUserEngagementLevel(msg); // Replace with actual user engagement level

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


// Function to get user points (replace with your data retrieval logic)
function getUserPoints(msg) {
    // Implement logic to retrieve user points from user data
    // For example, you can read from a JSON file or database
    return 250; // Replace with actual user points
}

// Function to get user engagement level (replace with your data retrieval logic)
function getUserEngagementLevel(msg) {
    // Implement logic to retrieve user engagement level from user data
    // For example, you can read from a JSON file or database
    return 'Guardian'; // Replace with actual user engagement level
}

// Export the functions to be used in other scripts
export {
    handleTreasureHunt,
    handleEducation,
    handleRewards
};
