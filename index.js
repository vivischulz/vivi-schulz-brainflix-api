const express = require("express");
const path = require("node:path");
const { getNewId, writeJSONFile} = require("./helper/helper");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send(path.join(__dirname, "public", "index.html"));
});

const videosJSONFile = path.join(__dirname, "./data/videos.json");
const videos = require(videosJSONFile);


//http://localhost:3333/api/videos
app.get("/api/videos", (_req, res) => {
  res.status(200).json(videos);
});

//get a video by its ID
app.get("/api/videos/:videoId", (req, res) => {
  const found = videos.find((video) => video.id === req.params.videoId);

  if (found) {
    res.status(200).json(found);
  } else {
    res.status(404).json({ error: `Video with ID ${req.params.id} not found` });
  }
});

//create a new video with title, discription, image
app.post("/api/videos",(req, res)=>{

    const { title, discription, image} = req.body;
    if(!title || !discription || !course){
        return res.status(400).json({
            error:"Please provide title, discription and image for adding video"
        });
    }

    const newVideo = {
        title,
        discription,
        image,
        id:getNewId()
    };

    videos.push(newVideo);
    writeJSONFile(videosJSONFile, videos);

    res.status(201).json(newVideo);
}); 


app.path("/api/videos/:id", (req, res) => {
  const found = doesVideoExist(req.params.id);
  if (found) {
    const updatedVideos = videos.map((video) =>
      video.id === req.params.id ? { ...video, ...req.body } : video
    );
    helper.writeJSONFile(videosJSONFile, updatedVideos);

    res.json({ msg: "Video Updated", videos: updatedVideos });
  } else {
    res
      .status(404)
      .json({ errorMessage: `Video with ID: ${req.params.id} not found` });
  }
});

app.delete("/api/videos/:id", (req, res) => {
  const found = doesVideoExist(req.params.id);
  if (found) {
    const videosAfterDeletion = videos.filter(
      (video) => video.id !== req.params.id
    );
    helper.writeJSONFile(videosJSONFile, videosAfterDeletion);
    res.json({
      msg: `video with ID: ${req.params.id} Deleted`,
      videos: videosAfterDeletion,
    });
  } else {
    res
      .status(404)
      .json({ errorMessage: `Video with ID: ${req.params.id} not found` });
  }
});


app.listen(3333, () => {
  console.log(`Server is running on port 3333 🍡`);
});
