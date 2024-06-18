const TelegramBot = require('node-telegram-bot-api');
const token = '6698692647:AAG7DXZNMyzROLgtqHQu-ztYvKeM3s3Fbl8'; // Replace with your actual bot token
const bot = new TelegramBot(token, { polling: true });

// Function to handle positive integer input
function getPositiveInt(chatId, prompt, callback) {
  bot.sendMessage(chatId, prompt).then(() => {
    bot.once('message', (msg) => {
      const num = parseInt(msg.text, 10);
      if (!isNaN(num) && num > 0) {
        callback(num);
      } else {
        bot.sendMessage(chatId, "Please enter a valid positive number.");
        getPositiveInt(chatId, prompt, callback);
      }
    });
  });
}

// Function to handle name input
function getName(chatId, prompt, callback) {
  bot.sendMessage(chatId, prompt).then(() => {
    bot.once('message', (msg) => {
      if (msg.text.trim()) {
        callback(msg.text.trim());
      } else {
        bot.sendMessage(chatId, "Name cannot be empty.");
        getName(chatId, prompt, callback);
      }
    });
  });
}

// Function to handle gender input
function getGender(chatId, prompt, callback) {
  bot.sendMessage(chatId, prompt).then(() => {
    bot.once('message', (msg) => {
      const gender = msg.text.trim().toLowerCase();
      if (gender === "male" || gender === "female" || gender === "other") {
        callback(gender);
      } else {
        bot.sendMessage(chatId, "Please enter 'male', 'female', or 'other'.");
        getGender(chatId, prompt, callback);
      }
    });
  });
}

// Function to process user data
function processUserData(chatId, name, age, gender) {
  const year = 2024;
  const dob = year - age;
  const driverLicenseAge = 18;
  const titles = { male: "Mr.", female: "Ms.", other: "Mx." };

  bot.sendMessage(chatId, `\nHello, ${titles[gender]} ${name}`);

  bot.sendMessage(chatId, "According to your data:");

  if (age >= driverLicenseAge) {
    bot.sendMessage(chatId, "You are eligible to drive.");
  } else {
    bot.sendMessage(chatId, "You are not eligible to drive.");
  }

  bot.sendMessage(chatId, `Your date of birth is ${dob}`);

  const yearEligible = dob + driverLicenseAge;
  if (yearEligible <= year) {
    bot.sendMessage(chatId, `You have been eligible to drive since ${yearEligible}. 🫡`);
  } else {
    bot.sendMessage(chatId, `You will be eligible to drive in ${yearEligible}.`);
  }

  const yearsLeft = driverLicenseAge - age;
  if (yearsLeft > 0) {
    bot.sendMessage(chatId, `You have ${yearsLeft} years left until you can get your driver's license.`);
  } else {
    const yearsSinceEligible = age - driverLicenseAge;
    bot.sendMessage(chatId, `You have been eligible to drive for ${yearsSinceEligible} years.`);
  }
}

// Start the bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  getName(chatId, "Enter your name: ", (name) => {
    getPositiveInt(chatId, "Enter your age: ", (age) => {
      getGender(chatId, "Enter your gender (male/female/other): ", (gender) => {
        processUserData(chatId, name, age, gender);
      });
    });
  });
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Available commands:\n/start - Start interaction\n/help - List of commands');
});

console.log('Bot is running...');
