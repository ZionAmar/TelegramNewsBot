import fs from "fs";
import path from "path";
import { delay, downloadFile } from "./utils.js";
import { loadSentMessages, saveSentMessages } from "./check.js";

export const sendMessage = async (bot, message, chatId) => {
  try {
    const fullText = `${message.text}\n\nמקור: ${message.credit}`;
    const mediaGroup = [];
    const downloadedVideos = new Set();
    const tempFiles = [];

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
        tempFiles.push(filePath);

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
    } else if (fullText) {
      await bot.telegram.sendMessage(chatId, fullText, { parse_mode: 'Markdown' });
      console.log('Text message sent successfully.');
    }

    // Clean up temporary video files
    for (const filePath of tempFiles) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting temporary file ${filePath}: ${err.message}`);
        }
      });
    }

    // Save sent message to prevent duplicates
    let sentMessages = loadSentMessages();
    const messageKey = message.text.split(" ").slice(0, 5).join(" ");
    if (!sentMessages.includes(messageKey)) {
      sentMessages.push(messageKey);
      saveSentMessages(sentMessages);
    }

    // Add delay of 5 seconds between each message sending
    await delay(5000);
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
  }
};
