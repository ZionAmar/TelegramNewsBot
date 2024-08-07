
import fs from "fs";
import fetch from "node-fetch";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const downloadFile = async (url, filePath) => {
  const response = await fetch(url);
  const fileStream = fs.createWriteStream(filePath);
  return new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
};



export const sanitizeTextForHTML = (text) => {
  if (!text) return "";

  // ניקוי תגיות HTML
  const sanitizedText = text
    .replace(/<br\s*\/?>/gi, "\n") // המרת <br> ל- \n
    .replace(/<\/?[^>]+>/g, "") // הסרת תגיות HTML
    .replace(/&nbsp;/g, " ") // המרת &nbsp; לרווח
    .replace(/&amp;/g, "&") // המרת &amp; ל- &
    .replace(/&quot;/g, '"') // המרת &quot; ל- "
    .replace(/&apos;/g, "'") // המרת &apos; ל- '
    .replace(/&lt;/g, "<") // המרת &lt; ל- <
    .replace(/&gt;/g, ">"); // המרת &gt; ל- >

  // המרת תגיות <b> ל- **
  let markdownText = sanitizedText.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  
  // המרת תגיות <i> ל- __
  markdownText = markdownText.replace(/<i>(.*?)<\/i>/gi, '__$1__');

  return markdownText;
};

export const getFirstFiveWords = (text) => {
  if (!text) return "";
  return text.split(" ").slice(0, 5).join(" ");
};

