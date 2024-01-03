const Developer = require("../models/developer");
const Game = require("../models/game");
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
  const developer = await Developer.findById(req.params.id).exec();

  //TODO: Add games by developer
  const gamesByDeveloper = await Game.find(
    { developer: req.params.id },
    "name description img image_url"
  )
    .sort({ name: 1 })
    .exec();

  if (developer === null) {
    const err = new Error("Developer not found");
    res.status = 404;
    return next(err);
  }

  res.render("developer_detail", {
    title: "Developer Detail",
    developer: developer,
    games_by_developer: gamesByDeveloper,
  });
});

exports.developer_create_get = asyncHandler(async (req, res, next) => {
  res.render("developer_form", { title: "Create Developer" });
});

exports.developer_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name of the developer must be specified,")
    .isAlphanumeric()
    .withMessage("Name contains non alphanumber symbols.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const developer = new Developer({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      res.render("developer_form", {
        title: "Create Developer",
        developer: developer,
        errors: errors.array(),
      });
    } else {
      await developer.save();
      res.redirect(developer.url);
    }
  }),
];

exports.developer_update_get = asyncHandler(async (req, res, next) => {
  const developer = await Developer.findById(req.params.id).exec();
  if (author === null) {
    res.redirect("/catalog/developers");
  } else {
    res.render("developer_form", {
      title: "Update developer",
      developer: developer,
    });
  }
});

exports.developer_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name of the developer must be specified,")
    .isAlphanumeric()
    .withMessage("Name contains non alphanumber symbols."),
  ,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const developer = new Developer({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("developer_form", {
        title: "Update developer",
        developer: developer,
        errors: errors.array(),
      });
    } else {
      const updatedDeveloper = await Developer.findByIdAndUpdate(
        req.params.id,
        developer,
        {}
      );
      res.redirect(developer.url);
    }
  }),
];

exports.developer_delete_get = asyncHandler(async (req, res, next) => {
  const [developer, gamesByDeveloper] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }, "name description").exec(),
  ]);

  if (developer === null) {
    res.redirect("/catalog/developers");
  }

  res.render("developer_delete", {
    title: "Delete dev",
    developer: developer,
    games_by_developer: gamesByDeveloper,
  });
});

exports.developer_delete_post = asyncHandler(async (req, res, next) => {
  const [developer, gamesByDeveloper] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }, "name description").exec(),
  ]);

  if (gamesByDeveloper.length > 0) {
    res.render("developer_delete", {
      title: "Delete developer",
      developer: developer,
      games_by_developer: gamesByDeveloper,
    });
  } else {
    await Developer.findByIdAndDelete(req.body.developerid);
    res.redirect("/catalog/developers");
  }
});
