const Developer = require("../models/developer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
exports.developer_list = asyncHandler(async (req, res, next) => {
  const allDevelopers = await Developer.find().sort({ name: 1 }).exec();

  res.render("developer_list", {
    title: "Developer list",
    developers: allDevelopers,
  });
});

exports.developer_detail = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.developer_create_get = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.developer_create_post = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.developer_update_get = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.developer_update_post = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.developer_delete_get = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});

exports.developer_delete_post = asyncHandler(async (req, res, next) => {
  console.log("To be made");
});
