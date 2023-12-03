const express = require("express");
const { getPosts, getPost, createPost, updatePost, deletePost, likePost, getPostsBySearch, commentPost } = require("../controllers/posts");
const auth = require("../middleware/auth");

const postRoutes = express.Router();

postRoutes.get("/", getPosts);

postRoutes.get("/show/:id", getPost);

postRoutes.get("/search", getPostsBySearch);

postRoutes.post("/", auth, createPost);

postRoutes.patch("/:id", auth, updatePost);

postRoutes.delete("/:id", auth, deletePost);

postRoutes.patch("/:id/likePost", auth, likePost);

postRoutes.post("/:id/comment", auth, commentPost);

module.exports = postRoutes;