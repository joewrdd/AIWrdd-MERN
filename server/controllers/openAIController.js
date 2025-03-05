const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ContentHistoryModel = require("../models/ContentHistoryModel");
const UserModel = require("../models/UserModel");
require("dotenv").config();

//----- Initialize Google AI -----
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

//----- OpenAI Controller -----
const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const userResponse = response.text();

    const newContentHistory = await ContentHistoryModel.create({
      user: req?.user?._id,
      content: userResponse,
    });
    //Creation of History
    const userFound = await UserModel.findById(req?.user?.id);
    //Pushing History To Specific User
    userFound.history.push(newContentHistory?._id);
    //Update The Api Request Count For apiRequestCount
    userFound.apiRequestCount += 1;
    await userFound.save();
    res.status(200).json({ message: userResponse });
  } catch (error) {
    console.error("Gemini API Error:", error);
    console.error(
      "Error Details:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Error generating content",
      details: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = openAIController;
