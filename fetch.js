import axios from "axios";
import cheerio from "cheerio";
import { sanitizeTextForHTML, getFirstFiveWords, downloadFile } from "./utils.js";

export const fetchLatestMessage = async (channel) => {
  try {
    console.log(`Fetching latest message from ${channel.url}`);
    const response = await axios.get(channel.url);
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);
    const element = $(".tgme_widget_message_wrap").last();
    let messageText = $(element).find(".tgme_widget_message_text").html()?.trim();

    const images = [];
    $(element).find(".tgme_widget_message_photo_wrap").each((i, el) => {
      const style = $(el).css("background-image");
      if (style) {
        const imageUrl = style.slice(5, -2).replace(/['"]/g, "");
        if (imageUrl) images.push(imageUrl);
      }
    });

    const videos = [];
    $(element).find("video").each((i, el) => {
      const videoUrl = $(el).attr("src");
      if (videoUrl) {
        const completeVideoUrl = videoUrl.startsWith("//")
          ? `https:${videoUrl}`
          : videoUrl;
        if (completeVideoUrl) videos.push(completeVideoUrl);
      }
    });

    const messageId = $(element).attr("data-id");
    const sanitizedText = sanitizeTextForHTML(messageText);
    const firstFiveWords = getFirstFiveWords(sanitizedText);
    const messageKey = `${firstFiveWords}-${channel.name}`;

    console.log('Fetched message:', {
      id: messageId,
      text: sanitizedText,
      images: images,
      videos: videos,
      credit: channel.name,
      key: messageKey
    });

    return {
      id: messageId,
      text: sanitizedText,
      images: images,
      videos: videos,
      credit: channel.name,
      key: messageKey,
    };
  } catch (error) {
    console.error(`Error fetching latest message from ${channel.url}: ${error.message}`);
    return null;
  }
};
