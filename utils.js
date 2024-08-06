import fs from "fs";
import axios from "axios";

export const downloadFile = async (url, filePath) => {
  try {
    console.log(`Downloading file from ${url}`);
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading file from ${url}: ${error.message}`);
    throw error;
  }
};

export const sanitizeTextForHTML = (text) => {
  if (!text) return "";
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
};

export const getFirstFiveWords = (text) => {
  if (!text) return "";
  return text.split(" ").slice(0, 5).join(" ");
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
