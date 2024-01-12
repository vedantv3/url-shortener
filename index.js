const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRouter");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url-node").then(() =>
  console.log("MongoDB connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files if you have staticRoute defined
app.use("/", staticRoute);

app.get('/test', async (req, res) => {
  const allUrls = await URL.find({});
  return res.render('home', {
    urls: allUrls,
  });
});

app.use("/url", urlRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  res.send("Visited successfully");
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
