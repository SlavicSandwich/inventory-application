const Publisher = require("../models/publisher");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.publisher_list = asyncHandler(async (req, res, next) => {
  const publishers = await Publisher.find().sort({ name: 1 }).exec();

  res.render("publisher_list", {
    title: "Publisher list",
    publishers: publishers,
  });
});

exports.publisher_detail = asyncHandler(async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.id).exec();

  //TODO: add display games published
  const gamesByPublisher = await Game.find(
    { publisher: req.params.id },
    "name description img image_url"
  )
    .sort({ name: 1 })
    .exec();

  if (publisher === null) {
    const err = new Error("Publisher not found");
    res.status = 404;
    return next(err);
  }

  res.render("publisher_detail", {
    title: "Publisher Detail",
    publisher: publisher,
    games_by_publisher: gamesByPublisher,
  });
});

exports.publisher_create_get = asyncHandler(async (req, res, next) => {
  res.render("publisher_form", { title: "Create publisher" });
});

exports.publisher_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name of the publisher must be specified,")
    .isAlphanumeric()
    .withMessage("Name contains non alphanumber symbols.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const publisher = new Publisher({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      res.render("publisher_form", {
        title: "Create publisher",
        publisher: publisher,
        errors: errors.array(),
      });
    } else {
      await publisher.save();
      res.redirect(publisher.url);
    }
  }),
];

exports.publisher_update_get = asyncHandler(async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.id).exec();
  if (publisher === null) {
    res.redirect("/catalog/publishers");
  } else {
    res.render("publisher_form", {
      title: "Update publisher",
      publisher: publisher,
    });
  }
});

exports.publisher_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name of the publisher must be specified,")
    .isAlphanumeric()
    .withMessage("Name contains non alphanumber symbols."),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const publisher = new Publisher({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("publisher_form", {
        title: "Update publisher",
        publisher: publisher,
        errors: errors.array(),
      });
    } else {
      const publisherExists = await Publisher.findOne({
        name: req.body.name,
      }).exec();
      if (publisherExists) {
        res.redirect(publisherExists.url);
      } else {
        const updatedPublisher = await Publisher.findByIdAndUpdate(
          req.params.id,
          publisher,
          {}
        );
        res.redirect(publisher.url);
      }
    }
  }),
];

exports.publisher_delete_get = asyncHandler(async (req, res, next) => {
  const [publisher, gamesBypublisher] = await Promise.all([
    Publisher.findById(req.params.id).exec(),
    Game.find({ publisher: req.params.id }, "name description").exec(),
  ]);

  if (publisher === null) {
    res.redirect("/catalog/publishers");
  }

  res.render("publisher_delete", {
    title: "Delete dev",
    publisher: publisher,
    games_by_publisher: gamesBypublisher,
  });
});

exports.publisher_delete_post = asyncHandler(async (req, res, next) => {
  const [publisher, gamesBypublisher] = await Promise.all([
    Publisher.findById(req.params.id).exec(),
    Game.find({ publisher: req.params.id }, "name description").exec(),
  ]);

  if (gamesBypublisher.length > 0) {
    res.render("publisher_delete", {
      title: "Delete publisher",
      publisher: publisher,
      games_by_publisher: gamesBypublisher,
    });
  } else {
    await publisher.findByIdAndDelete(req.body.publisherid);
    res.redirect("/catalog/publishers");
  }
});
