const express = require("express");
const { signin, signup } = require("../controllers/user");
const userRoutes = express.Router();

userRoutes.post("/signin", signin);

userRoutes.post("/signup", signup);

module.exports = userRoutes;