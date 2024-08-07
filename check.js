import fs from "fs";
import { fetchLatestMessage } from "./fetch.js";
import { sendMessage } from "./send.js";
import { delay } from "./utils.js";

const sentMessagesFile = "sent_messages.json";

export const loadSentMessages = () => {
  if (fs.existsSync(sentMessagesFile)) {
    return JSON.parse(fs.readFileSync(sentMessagesFile));
  }
  return [];
};

export const saveSentMessages = (sentMessages) => {
  fs.writeFileSync(sentMessagesFile, JSON.stringify(sentMessages, null, 2));
};

export const checkForNewMessages = async (bot, chatId, channels) => {
  console.log("Checking for new messages...");
  let sentMessages = loadSentMessages();

  for (const channel of channels) {
    const message = await fetchLatestMessage(channel);
    if (message) {
      const messageKey = message.text.split(" ").slice(0, 5).join(" ");

      if (!sentMessages.includes(messageKey)) {
        console.log(`New message found: ${messageKey}`);
        sentMessages.push(messageKey);
        saveSentMessages(sentMessages);
        await sendMessage(bot, message, chatId);

        // Add delay of 5 seconds between each message sending
        await delay(5000);
      } else {
        console.log(`Message already sent: ${messageKey}`);
      }
    } else {
      console.log(`No new message found for channel: ${channel.name}`);
    }

    // Add delay of 5 seconds between each channel check
    await delay(5000);
  }
};
