const express = require("express");
const router = express.Router();

const game_controller = require("../controllers/gameController");
const developer_controller = require("../controllers/developerController");
const publisher_controller = require("../controllers/publisherController");
const genre_controller = require("../controllers/genreController");

router.get("/", game_controller.index);

router.get("/game/create", game_controller.game_create_get);
router.post("/game/create", game_controller.game_create_post);

router.get("/game/:id/delete", game_controller.game_delete_get);
router.post("/game/:id/delete", game_controller.game_delete_post);

router.get("/game/:id/update", game_controller.game_update_get);
router.post("/game/:id/update", game_controller.game_update_post);

router.get("/games", game_controller.game_list);
router.get("/game/:id", game_controller.game_detail);

router.get("/developer/create", developer_controller.developer_create_get);
router.post("/developer/create", developer_controller.developer_create_post);

router.get("/developer/:id/delete", developer_controller.developer_delete_get);
router.post(
  "/developer/:id/delete",
  developer_controller.developer_delete_post
);

router.get("/developer/:id/update", developer_controller.developer_update_get);
router.post(
  "/developer/:id/update",
  (req, res) => developer_controller.developer_update_post
);

router.get("/developers", developer_controller.developer_list);
router.get("/developer/:id", developer_controller.developer_detail);

router.get("/publisher/create", publisher_controller.publisher_create_get);
router.post("/publisher/create", publisher_controller.publisher_create_post);

router.get("/publisher/:id/delete", publisher_controller.publisher_delete_get);
router.post(
  "/publisher/:id/delete",
  publisher_controller.publisher_delete_post
);

router.get("/publisher/:id/update", publisher_controller.publisher_update_get);
router.post(
  "/publisher/:id/update",
  publisher_controller.publisher_update_post
);

router.get("/publishers", publisher_controller.publisher_list);
router.get("/publisher/:id", publisher_controller.publisher_detail);

router.get("/genre/create", genre_controller.genre_create_get);
router.post("/genre/create", genre_controller.genre_create_post);

router.get("/genre/:id/delete", genre_controller.genre_delete_get);
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

router.get("/genre/:id/update", genre_controller.genre_update_get);
router.post("/genre/:id/update", genre_controller.genre_update_post);

router.get("/genres", genre_controller.genre_list);
router.get("/genre/:id", genre_controller.genre_detail);

module.exports = router;
