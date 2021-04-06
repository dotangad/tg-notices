require("dotenv").config();
const axios = require("axios");
const RSSParser = require("rss-parser");

const FEED_URL = "https://dpsrkp.net/category/notices/feed/";
const API_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

async function sendMessage(msg) {
  try {
    await axios.post(API_URL, {
      chat_id: process.env.CHAT_ID,
      text: msg,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  } catch (e) {
    console.error(e);
  }
}

(async function main() {
  try {
    // const rssData = (await axios.get(FEED_URL)).data;
    const now = Date.now();
    const parser = new RSSParser();
    const data = (await parser.parseURL(FEED_URL)).items
      .map(({ title, link, pubDate }) => ({ title, link, pubDate }))
      .filter(
        ({ pubDate }) => now - new Date(pubDate).getTime() < 10 * 60 * 1000
      );

    data.forEach(({ title, link }) =>
      sendMessage(`<a href="${link}">${title}</a>`)
    );
  } catch (e) {
    console.error(e);
  }
})();
