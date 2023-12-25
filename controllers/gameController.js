const Game = require("../models/game");
const Developer = require("../models/developer");
const Publisher = require("../models/publisher");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.game_list = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.game_detail = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.game_create_get = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.game_create_post = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.game_update_get = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.game_update_post = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.game_delete_get = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.game_delete_post = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});
