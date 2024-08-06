import fs from "fs";

const settingsFile = "settings.json";

export const loadSettings = () => {
  if (fs.existsSync(settingsFile)) {
    return JSON.parse(fs.readFileSync(settingsFile));
  } else {
    return {
      botToken: "",
      chatId: "",
      channels: [],
      checkInterval: 10 * 60 * 1000,
      sentMessages: {},
    };
  }
};

export const saveSettings = (settings) => {
  fs.writeFileSync(settingsFile, JSON.stringify(settings));
};
