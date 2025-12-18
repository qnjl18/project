import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db, admin } from "./firebase.js";
import userController from "./APIs/userController.js";
import addUser from "./APIs/addUser.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", userController);
app.use("/", addUser);

app.get("/", (req, res) => {
  res.send("Server is running on localhost:3000");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);

});
