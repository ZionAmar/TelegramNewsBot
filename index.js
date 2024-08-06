import express from "express";
import bodyParser from "body-parser";
import { initializeBot, stopBot } from "./bot.js";
import { loadSettings, saveSettings } from "./settings.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let { botToken, chatId, channels, checkInterval } = loadSettings();

app.get("/", (req, res) => {
  res.sendFile("settings.html", { root: __dirname });
});

app.post("/update-settings", (req, res) => {
  botToken = req.body.botToken;
  chatId = req.body.chatId;
  channels = [
    { url: req.body.channel1Url, name: req.body.channel1Name },
    { url: req.body.channel2Url, name: req.body.channel2Name },
    { url: req.body.channel3Url, name: req.body.channel3Name },
  ];
  checkInterval = parseInt(req.body.checkInterval) * 60 * 1000;

  saveSettings({ botToken, chatId, channels, checkInterval });

  res.send('Settings updated. <a href="/">Back</a>');

  initializeBot(botToken, chatId, channels, checkInterval);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

initializeBot(botToken, chatId, channels, checkInterval);
