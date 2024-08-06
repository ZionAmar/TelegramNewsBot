import fs from "fs";
import path from "path";
import { delay, downloadFile } from "./utils.js";
import { loadSettings } from "./settings.js";

const sentMessagesFile = "sent_messages.json";
let sentMessages = loadSettings().sentMessages || {};

export const sendMessage = async (bot, message, chatId) => {
  try {
    const fullText = `${message.text}\n\nמקור: ${message.credit}`;
    const mediaGroup = [];
    const downloadedVideos = new Set();

    for (const image of message.images) {
      mediaGroup.push({
        type: "photo",
        media: image,
        caption: fullText,
      });
    }

    for (const [index, videoUrl] of message.videos.entries()) {
      if (!downloadedVideos.has(videoUrl)) {
        const filePath = path.join(process.cwd(), `temp_video_${index}.mp4`);
        await downloadFile(videoUrl, filePath);

        mediaGroup.push({
          type: "video",
          media: { source: filePath },
          caption: index === 0 ? fullText : "",
        });

        downloadedVideos.add(videoUrl);
      }
    }

    if (mediaGroup.length > 0) {
      await bot.telegram.sendMediaGroup(chatId, mediaGroup);
      console.log('Media group sent successfully.');
      mediaGroup.forEach((media) => {
        if (media.type === "video") {
          fs.unlink(media.media.source, (err) => {
            if (err) {
              console.error(`Error deleting temporary file ${media.media.source}: ${err.message}`);
            }
          });
        }
      });
    } else if (fullText) {
      await bot.telegram.sendMessage(chatId, fullText);
      console.log('Text message sent successfully.');
    }

    await delay(5000);

    if (!sentMessages[message.credit]) {
      sentMessages[message.credit] = [];
    }
    sentMessages[message.credit].push(message.key);
    fs.writeFileSync(sentMessagesFile, JSON.stringify(sentMessages));
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
  }
};
