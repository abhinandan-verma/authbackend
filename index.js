import mongoose, { connection } from "mongoose";
import dotenv from "dotenv";
import colors from "@colors/colors";
import { connection } from "./db.js";
import express from "express";
import { router } from "./routes.js";
import cors from "cors";
dotenv.config();

const app = express();

let DB_URL = process.env.DB_URL || "mongodb://localhost:27017/express-mongoose";

const port = process.env.PORT || 8000;

(async function db (){
    await connection();
})();

app.use(cors());
app.use(express.json());
app.use(router);
app.use("/api/v1", router);

app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
  });

app.listen(port, () => {
    console.log(colors.green(`Server is running on port ${port}`));
});

module.exports = app;
