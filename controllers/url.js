const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  console.log("Request Body:", req.body);
  const body = req.body;
  if (!body.url) {
    console.log("URL is missing!");
    return res.status(400).json({ error: "url is required" });
  }
  const shortId = shortid(); // Use consistent naming (shortId) here

  await URL.create({
    shortId: shortId, // Use consistent naming (shortId) here
    redirectURL: body.url,
    visitHistory: [],
  });
  return res.render('home', {
    id: shortId,
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
