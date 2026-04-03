import axios from "axios";
import * as cheerio from "cheerio";

function isYouTube(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function isTwitter(url) {
  return url.includes("twitter.com") || url.includes("x.com");
}

// 🔥 YouTube
async function getYouTube(url) {
  const res = await axios.get(
    `https://www.youtube.com/oembed?url=${url}&format=json`,
  );

  return {
    title: res.data.title,
    description: res.data.author_name,
    image: res.data.thumbnail_url,
    content: res.data.title,
  };
}

// 🔥 Twitter
async function getTwitter(url) {
  const res = await axios.get(`https://publish.twitter.com/oembed?url=${url}`);

  return {
    title: "Tweet",
    description: res.data.author_name,
    image: "",
    content: res.data.html?.replace(/<[^>]*>/g, ""),
  };
}

// 🔥 Web Scraper
async function getWeb(url) {
  const { data } = await axios.get(url, { timeout: 12000 });
  const $ = cheerio.load(data);

  const title =
    $("title").text() || $('meta[property="og:title"]').attr("content") || url;

  const description = $('meta[name="description"]').attr("content") || "";

  const image = $('meta[property="og:image"]').attr("content") || "";

  const content = $("p")
    .map((i, el) => $(el).text())
    .get()
    .join(" ")
    .slice(0, 2000);

  return {
    title,
    description,
    image,
    content,
  };
}

// 🔥 MAIN FUNCTION
export async function extractContent(url) {
  try {
    if (isYouTube(url)) return await getYouTube(url);
    if (isTwitter(url)) return await getTwitter(url);

    return await getWeb(url);
  } catch (err) {
    return {
      title: url,
      description: "",
      image: "",
      content: url,
      tags: [],
    };
  }
}
