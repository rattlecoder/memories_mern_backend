const express = require('express');
const dotenv = require("dotenv");
// activate .env file
dotenv.config();
const dbConnect = require("./config/dbConnect.js");
const bodyParser = require('body-parser');
const cors = require('cors');
const postRoutes = require("./routes/posts");
const userRoutes = require('./routes/users.js');

const app = express();
// make the database connection
dbConnect();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


// posts route
app.use("/api/v1/posts", postRoutes);

// users route
app.use("/api/v1/users", userRoutes);


// listen to some port
const PORT = process.env.port || 9000;
app.listen(PORT,console.log(`Server is up and running on port ${PORT}`));




