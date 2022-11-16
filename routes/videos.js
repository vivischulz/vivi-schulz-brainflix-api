const express = require("express");
const router = express.Router();

const path = require("node:path");

const videosJSONFile = path.join(__dirname, "../data/videos.json");
const videos = require(videosJSONFile);

const { getNewId, writeJSONFile } = require("../helper/helper");

//http://localhost:4000/api/videos
router.get("/", (_req, res) => {
    try{
  res.status(200).json(videos);
    }catch(err){
        console.log("Error retrieving the videos", err);
    }
});

//get a video by its ID
router.get("/:videoId", (req, res) => {
  const found = videos.find((video) => video.id === req.params.videoId);

  if (found) {
    res.status(200).json(found);
  } else {
    res
      .status(404)
      .json({ error: `Video with ID ${req.params.videoId} not found` });
  }
});

//create a new video with title, discription, image
router.post("/",(req, res)=>{

    const { title, discription} = req.body;
    if(!title || !discription){
        return res.status(400).json({
            error:"Please provide title, discription and image for adding video"
        });
    }

    const newVideo = {
        title,
        discription,
        id:getNewId()
    };

    videos.push(newVideo);
    writeJSONFile(videosJSONFile, videos);

    res.status(201).json(newVideo);
}); 


router.patch("/:videoid", (req, res) => {
  const found = videos.some((video)=>video.id === req.params.videoid);
  if (found) {
    const updatedVideos = videos.map((video) =>
      video.id === req.params.videoId ? { ...video, ...req.body } : video
    );
    writeJSONFile(videosJSONFile, updatedVideos);

    res.json({ msg: "Video Updated", videos: updatedVideos });
  } else {
    res
      .status(404)
      .json({ errorMessage: `Video with ID: ${req.params.videoId} not found` });
  }
});

router.delete("/:videoId", (req, res) => {
  const found = videos.some((video)=>video.id === req.params.videoId);
  if (found) {
    const videosAfterDeletion = videos.filter(
      (video) => video.id !== req.params.videoId
    );
    helper.writeJSONFile(videosJSONFile, videosAfterDeletion);
    res.json({
      msg: `video with ID: ${req.params.videoId} Deleted`,
      videos: videosAfterDeletion,
    });
  } else {
    res
      .status(404)
      .json({ errorMessage: `Video with ID: ${req.params.videoId} not found` });
  }
});


module.exports = router;