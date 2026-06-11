const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const cors = require("cors");


const app = express();

const DB_path = process.env.MONGO_URL;
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend Connected Successfully"
  });
});

const PORT = 3000;

mongoose.connect(DB_path)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log("Error connecting to MongoDB:", err);
  });