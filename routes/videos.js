const express = require("express");
const router = express.Router();

const path = require("node:path");

const videosJSONFile = path.join(__dirname, "../data/videos.json");
const videos = require(videosJSONFile);

const { getNewId, writeJSONFile } = require("../helper/helper");

const { generateName } = require("../helper/name");

//http://localhost:8080/api/videos
router.get("/", (_req, res) => {
  try {
    res.status(200).json(videos);
  } catch (err) {
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

router.post("/:videoId/comments", (req, res) => {
  const found = videos.find((video) => video.id === req.params.videoId);

  if (found) {
    const { comment } = req.body;

    const newComment = {
      name: "vivi",
      comment,
      timestamp: new Date().getTime(),
      id: getNewId(),
    };

    if (!comment) {
      return res.status(400).json({ error: "Please provide your comment" });
    }
    const foundComments = found.comments;
    const newFoundComments = [...foundComments, newComment];
    newFoundComments.sort((a, b) => b.timestamp - a.timestamp);

    writeJSONFile(videosJSONFile, videos);

    res.status(201).json(newComment);
  } else {
    res.status(404).json({
      errorMessage: `Video with ID: ${req.params.commentId} not found, sorry you can comment on that.`,
    });
  }
});

//create a new video with title, description, image
router.post("/", (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !description || !image) {
    return res.status(400).json({
      error: "Please provide title, discription and image for adding video",
    });
  }

  const newVideo = {
    title,
    description,
    image,
    id: getNewId(),
    author: generateName(),
    channel: generateName(),
    views: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 100),
    duration: `${Math.floor(Math.random() * 10)}:${Math.floor(
      Math.random() * 10
    )}`,
    timestamp: new Date().getTime(),
    comments: [
      {
        id: getNewId(),
        name: generateName(),
        comment:
          "We are travelling to the states from the UK in September, taking a month to travel from Yellowstone to the San Francisco area taking in all the National Parks on the way.",
        like: 0,
        timestamp: new Date().getTime(),
      },
      {
        id: getNewId(),
        name: generateName(),
        comment:
          "No matter where you go in Europe, no matter what nation or city you visit, you will be surrounded by breathtaking scenery. Throughout the country, there are several natural wonders and impressive attractions.",
        like: Math.floor(Math.random() * 100),
        timestamp: new Date().getTime(),
      },
    ],
  };
  videos.push(newVideo);
  writeJSONFile(videosJSONFile, videos);

  res.status(201).json(newVideo);
});



router.delete("/:videoId/:commentId", (req, res) => {
  const { videoId, commentId } = req.params;
  const video = videos.filter((video)=> video.id === videoId);
  const comments = video[0].comments;


  if (videoId && commentId) {
    const commentsAfterDeletion = comments.filter(
      (comment) => comment.id !== commentId
    );      
   console.log(commentsAfterDeletion);

    writeJSONFile(videosJSONFile, videos);
    res.json({
      msg: `comment with ID: ${req.params.commentId} Deleted`,
      comments: commentsAfterDeletion,
    });
  } else {
    res
      .status(404)
      .json({ errorMessage: `Video with ID: ${req.params.commentId} not found` });
  }
});

module.exports = router;
