const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: { type: String, required: true },
  developer: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher", required: true },
  description: { type: String },
  release_date: { type: Date, default: Date.now },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre", required: true }],
  img: { type: String, default: "unspecified.png" },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Not out yet", "Out of stock"],
    default: "Available",
  },
  price: {
    type: Number,
    min: [0, "Game can't cost negative amount"],
    required: [true, "Game can't have no cost"],
    default: 1,
  },
});

GameSchema.virtual("url").get(function () {
  return `/catalog/game/${this._id}`;
});

GameSchema.virtual("release_date_formatted").get(function () {
  return DateTime.fromJSDate(this.release_date).toISODate(); // format "YYYY-MM-DD"
});

GameSchema.virtual("release_date_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.release_date).toISODate(); // format 'YYYY-MM-DD'
});

GameSchema.virtual("image_url").get(function () {
  return `/images/${this.img}`; // format "YYYY-MM-DD"
});

module.exports = mongoose.model("Game", GameSchema);
