const express = require("express");
const {
  viewContent,
  updateContent,
  deleteContent,
} = require("../controllers/historyController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const historyRouter = express.Router();

historyRouter.get("/:id", isAuthenticated, viewContent);
historyRouter.put("/:id", isAuthenticated, updateContent);
historyRouter.delete("/:id", isAuthenticated, deleteContent);

module.exports = historyRouter;
