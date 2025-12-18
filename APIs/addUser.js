import express from "express";
import { db, admin } from "../firebase.js";

const router = express.Router();

router.post("/users/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const newUser = {
      firstName,
      lastName,
      email,
      password,
      createdAt: admin.firestore.Timestamp.now(),
    };

    const docRef = await db.collection("users").add(newUser);
    res.status(201).json({ id: docRef.id, message: "Signup successful!" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .where("password", "==", password)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const user = snapshot.docs[0];
    res.json({
      message: "Login successful",
      id: user.id,
      data: user.data(),
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});


export default router;
