const Game = require("../models/game");
const Developer = require("../models/developer");
const Publisher = require("../models/publisher");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

//CODE TO STORE IMAGES

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//Multer upload instance
const upload = multer({ storage: storage });

exports.index = asyncHandler(async (req, res, next) => {
  const [numAvailableGames, numGames, numPublishers, numDevelopers, numGenres] =
    await Promise.all([
      Game.countDocuments({ status: "Available" }).exec(),
      Game.countDocuments({}).exec(),
      Publisher.countDocuments({}).exec(),
      Developer.countDocuments({}).exec(),
      Genre.countDocuments({}).exec(),
    ]);

  res.render("index", {
    title: "Game invenotory!",
    game_count: numGames,
    available_game_count: numAvailableGames,
    developer_count: numDevelopers,
    publisher_count: numPublishers,
    genre_count: numGenres,
  });
});

exports.game_list = asyncHandler(async (req, res, next) => {
  const games = await Game.find().sort({ name: 1 }).exec();

  res.render("game_list", {
    title: "Games list",
    games: games,
  });
});

exports.game_detail = asyncHandler(async (req, res, next) => {
  const [game, gameInstance] = await Game.findById(req.params.id)
    .populate("genre")
    .populate("developer")
    .populate("publisher")
    .exec();

  if (game === null) {
    const err = new Error("game not found");
    res.status = 404;
    return next(err);
  }

  res.render("game_detail", {
    title: "Game detail",
    game: game,
  });
});

exports.game_create_get = asyncHandler(async (req, res, next) => {
  const [allDevelopers, allPublishers, allGenres] = await Promise.all([
    Developer.find().sort({ name: 1 }).exec(),
    Publisher.find().sort({ name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);
  res.render("game_form", {
    title: "Create game",
    developers: allDevelopers,
    publishers: allPublishers,
    genres: allGenres,
  });
});

exports.game_create_post = [
  upload.single("img"),

  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body("name", "Name of the game must no be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("developer", "Name of the developer must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("publisher", "Name of the publisher must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("release_date", "Invalid date")
    .optional({ value: "falsy" })
    .isISO8601()
    .toDate(),

  body("price", "Price must be specified")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape(),
  // body("img"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const game = new Game({
      name: req.body.name,
      developer: req.body.developer,
      description: req.body.description,
      release_date: req.body.release_date,
      genre: req.body.genre,
      img: req.file ? req.file.filename : null,
      status: req.body.status,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      const [allDevelopers, allPublishers, allGenres] = await Promise.all([
        Developer.find().sort({ name: 1 }).exec(),
        Publisher.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for (const genre of allGenres) {
        if (game.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      res.render("game_form", {
        title: "Create Game",
        developers: allDevelopers,
        publishers: allPublishers,
        genres: allGenres,
        game: game,
        errors: errors.array(),
      });
    } else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];

exports.game_update_get = asyncHandler(async (req, res, next) => {
  const [game, allDevelopers, allPublishers, allGenres] = await Promise.all([
    Game.findById(req.params.id)
      .populate("genre")
      .populate("developer")
      .populate("publisher")
      .exec(),
    Developer.find().sort({ name: 1 }).exec(),
    Publisher.find().sort({ name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  if (game === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  for (const genre of allGenres) {
    for (const game_g of game.genre) {
      if (genre._id.toString() === game_g._id.toString()) {
        genre.checked = "true";
      }
    }
  }

  res.render("game_form_update", {
    title: "Update game",
    developers: allDevelopers,
    publishers: allPublishers,
    genres: allGenres,
    game: game,
  });
});

exports.game_update_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body("name", "Name of the game must no be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("developer", "Name of the developer must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("publisher", "Name of the publisher must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("release_date", "Invalid date")
    .optional({ value: "falsy" })
    .isISO8601()
    .toDate(),

  body("price", "Price must be specified")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape(),
  // body("img"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const game = new Game({
      name: req.body.name,
      developer: req.body.developer,
      description: req.body.description,
      release_date: req.body.release_date,
      genre: req.body.genre,
      // img: req.file ? req.file.filename : null,
      status: req.body.status,
      price: req.body.price,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const [allDevelopers, allPublishers, allGenres] = await Promise.all([
        Developer.find().sort({ name: 1 }).exec(),
        Publisher.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for (const genre of allGenres) {
        if (game.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      res.render("game_form_update", {
        title: "Create Game",
        developers: allDevelopers,
        publishers: allPublishers,
        genres: allGenres,
        game: game,
        errors: errors.array(),
      });
    } else {
      const updategame = await Game.findByIdAndUpdate(req.params.id, game, {});
      res.redirect(updategame.url);
    }
  }),
];

exports.game_delete_get = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).exec();
  res.render("game_delete", {
    title: "Delete game",
    game: game,
  });
});

exports.game_delete_post = asyncHandler(async (req, res, next) => {
  const game = await Game.findByIdAndDelete(req.body.gameid);
  res.redirect("/catalog/games");
});
