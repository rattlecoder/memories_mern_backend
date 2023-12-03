const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String },
});

//compile schema to form model
const User = mongoose.model("User", userSchema);

//export model
module.exports = User;