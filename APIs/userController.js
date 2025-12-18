import express from "express";
import { db, admin } from "../firebase.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await db.collection("users").doc(req.params.id).set(updatedData, { merge: true });

    res.json({ id: req.params.id, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).delete();
    res.json({ id: req.params.id, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
