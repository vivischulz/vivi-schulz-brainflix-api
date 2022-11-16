require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("node:path");

const app = express();

const videoRouter = require("./routes/videos");

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/api/videos", videoRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port 4000 🍡`);
});
