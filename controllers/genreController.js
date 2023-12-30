const Genre = require("../models/genre");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.genre_list = asyncHandler(async (req, res, next) => {
  const genres = Genre.find().sort({ name: 1 }).exec();

  res.render("genre_list", {
    title: "Genre list",
    genres: genres,
  });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
  const genre = Genre.findById(req.params.id).exec();

  //TODO: add display game of this genre

  if (genre === null) {
    const err = new Error("Game not found");
    res.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
  });
});

exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
});

exports.genre_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name of the Genre must be specified,")
    .isAlphanumeric()
    .withMessage("Name contains non alphanumber symbols.")
    .escape(),
  body("description").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create genre",
        genre: genre,
        errors: errors.array(),
      });
    } else {
      await genre.save();
      res.redirect(genre.url);
    }
  }),
];

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();
  if (genre === null) {
    res.redirect("/catalog/genres");
  } else {
    res.render("genre_form", {
      title: "Update genre",
      genre: genre,
    });
  }
});

exports.genre_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name of the Genre must be specified,")
    .isAlphanumeric()
    .withMessage("Name contains non alphanumber symbols.")
    .escape(),
  body("description").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Update genre",
        genre: genre,
        errors: errors.array(),
      });
    } else {
      const updatedGenre = await Genre.findByIdAndUpdate(
        req.params.id,
        genre,
        {}
      );
      res.redirect(genre.url);
    }
  }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, gamesByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }, "name description").exec(),
  ]);
  if (genre === null) {
    res.redirect("/catalog/genres");
  } else {
    res.render("genre_delete", {
      title: "Delete Genre",
      genre: genre,
      games_by_genre: gamesByGenre,
    });
  }
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, gamesByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }, "name description").exec(),
  ]);
  if (gamesByGenre.length > 0) {
    res.redirect("genre_delete", {
      title: "Genre Delete",
      genre: genre,
      games_by_genre: gamesByGenre,
    });
  } else {
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genres");
  }
});
