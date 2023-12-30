const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: { type: String, required: true },
  developer: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
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
  },
});

GameSchema.virtual("url").get(function () {
  return `/catalog/game/${this._id}`;
});

module.exports = mongoose.model("Game", GameSchema);
