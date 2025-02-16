const asyncHandler = require("express-async-handler");
const ContentHistoryModel = require("../models/ContentHistoryModel");
const UserModel = require("../models/UserModel");

//----- View History Content -----
const viewContent = asyncHandler(async (req, res) => {
  const content = await ContentHistoryModel.findById(req.params.id);
  if (!content) {
    res.status(404);
    throw new Error("Content not found");
  }
  res.json(content);
});

//----- Update History Content -----
const updateContent = asyncHandler(async (req, res) => {
  const content = await ContentHistoryModel.findById(req.params.id);
  if (!content) {
    res.status(404);
    throw new Error("Content not found");
  }

  content.content = req.body.content;
  await content.save();

  res.json(content);
});

//----- Delete History Content -----
const deleteContent = asyncHandler(async (req, res) => {
  const content = await ContentHistoryModel.findById(req.params.id);
  if (!content) {
    res.status(404);
    throw new Error("Content not found");
  }

  await ContentHistoryModel.deleteOne({ _id: req.params.id });

  await UserModel.updateOne(
    { history: content._id },
    { $pull: { history: content._id } }
  );

  res.json({ message: "Content deleted successfully" });
});

module.exports = { viewContent, updateContent, deleteContent };
