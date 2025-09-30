const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const connectMongo = () => mongoose.connect(process.env.DB_URL);

module.exports = { connectMongo };
