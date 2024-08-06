import { Telegraf } from "telegraf";
import { checkForNewMessages } from "./check.js";
import { loadSettings } from "./settings.js";

let bot;

export const initializeBot = (botToken, chatId, channels, checkInterval) => {
  if (bot) {
    bot.stop();
    console.log("Previous bot instance stopped.");
  }

  if (botToken && chatId && channels.length > 0) {
    bot = new Telegraf(botToken);
    bot.launch();
    setInterval(() => checkForNewMessages(bot, chatId, channels), checkInterval);
    console.log("Bot initialized and started");
  } else {
    console.log("Bot settings are missing. Please update settings via the web interface.");
  }
};

export const stopBot = () => {
  if (bot) {
    bot.stop();
    console.log("Bot stopped.");
  }
};
