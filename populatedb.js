#! /usr/bin/env node

// console.log(
//   'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
// );

const Developer = require("./models/developer");
const Game = require("./models/game");
const Genre = require("./models/genre");
const Publisher = require("./models/publisher");

const developers = [];
const games = [];
const genres = [];
const publishers = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB =
  "mongodb+srv://SlavicSandwich:Artbb98262502@cluster0.sxathpp.mongodb.net/local_inventory?retryWrites=true&w=majority";

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createDevelopers();
  await createPublishers();
  await createGames();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name, description) {
  const genre_data = { name: name };
  if (description) genre_data.description = description;
  const genre = new Genre(genre_data);
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function developerCreate(index, name) {
  const developer_detail = { name };
  const developer = new Developer(developer_detail);

  await developer.save();
  developers[index] = developer;
  console.log(`Added Developer: ${name}`);
}

async function publisherCreate(index, name) {
  const publisher_detail = { name };

  const publisher = new Publisher(publisher_detail);
  await publisher.save();
  publishers[index] = publisher;
  console.log(`Added Publisher: ${name}`);
}

async function GameCreate(
  index,
  name,
  developer,
  description,
  release_date,
  genre,
  img,
  status,
  price
) {
  const game_detail = {
    name,
    developer,
    genre,
    status,
    price,
  };

  if (release_date) game_detail.release_date = release_date;
  if (description) game_detail.description = description;
  if (img) game_detail.img = img;

  const game = new Game(game_detail);
  await game.save();
  games[index] = game;
  console.log("Added Game: name");
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "FPS", "For those that want full immersion"),
    genreCreate(
      1,
      "RPG",
      "For those who want to shape the world to their liking"
    ),
    genreCreate(2, "Strategy"),
    genreCreate(3, "Action", "For those who love action"),
  ]);
}

async function createDevelopers() {
  console.log("Adding Developers");
  await Promise.all([
    developerCreate(0, "Respawn"),
    developerCreate(1, "Void"),
    developerCreate(2, "Team Ninja"),
    developerCreate(3, "Valve"),
    developerCreate(4, "CDPR"),
  ]);
}

async function createPublishers() {
  console.log("Adding Publishers");
  await Promise.all([
    publisherCreate(0, "EA"),
    publisherCreate(1, "Ubisoft"),
    publisherCreate(2, "Devolver"),
    publisherCreate(3, "Nigger"),
  ]);
}

async function createGames() {
  console.log("Adding authors");
  await Promise.all([
    GameCreate(
      0,
      "Ninja Gaiden",
      developers[2],
      "Ninja game",
      new Date(),
      genres[3],
      null,
      "Available",
      45
    ),
    GameCreate(
      1,
      "Assassin's creed",
      developers[1],
      "Assassin game",
      null,
      genres[3],
      null,
      "Available",
      60
    ),
    GameCreate(
      2,
      "Call of duty",
      developers[0],
      "Shooter game",
      null,
      genres[0],
      null,
      "Not out yet",
      0
    ),
  ]);
}
