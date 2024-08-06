import { fetchLatestMessage } from "./fetch.js";
import { sendMessage } from "./send.js";
import { loadSettings } from "./settings.js";

let sentMessages = loadSettings().sentMessages || {};

export const checkForNewMessages = async (bot, chatId, channels) => {
  console.log("Checking for new messages...");
  for (const channel of channels) {
    const message = await fetchLatestMessage(channel);
    if (
      message &&
      (!sentMessages[channel.name] ||
        !sentMessages[channel.name].includes(message.key))
    ) {
      console.log(`New message found: ${message.key}`);
      await sendMessage(bot, message, chatId);
    } else {
      console.log(`No new message found or message already sent: ${message?.key}`);
    }
  }
};
