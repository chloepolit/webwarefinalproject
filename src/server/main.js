import express from "express";
import ViteExpress from "vite-express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import bcrypt from "bcrypt";

const app = express();
const readings = [];

app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let db;

app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const users = db.collection("users");

    const existingUser = await users.findOne({ username });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Username already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      username,
      password: hashedPassword,
    });

    res.json({
      success: true,
      userId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Could not create account.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const users = db.collection("users");

    const user = await users.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.json({
        success: false,
        message: "Incorrect username or password.",
      });
    }

    res.json({
      success: true,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
});

app.get("/api/readings", (req, res) => {
  res.json(readings);
});

app.post("/api/readings", (req, res) => {
  const newReading = {
    _id: Date.now().toString(),
    title: req.body.title,
    author: req.body.author,
    course: req.body.course,
    type: req.body.type,
    url: req.body.url,
    pagesRead: Number(req.body.pagesRead),
    totalPages: Number(req.body.totalPages),
    status: req.body.status,
    dueDate: req.body.dueDate,
    notes: req.body.notes,
  };

  newReading.percentComplete = Math.round(
    (newReading.pagesRead / newReading.totalPages) * 100
  );

  readings.push(newReading);

  res.json(newReading);
});

app.put("/api/readings/:id", (req, res) => {
  const readingIndex = readings.findIndex(
    (reading) => reading._id === req.params.id
  );

  if (readingIndex === -1) {
    return res.status(404).json({ error: "Reading not found" });
  }

  const pagesRead = Number(req.body.pagesRead);
  const totalPages = Number(req.body.totalPages);

  const updatedReading = {
    _id: req.params.id,
    title: req.body.title,
    author: req.body.author,
    course: req.body.course,
    type: req.body.type,
    url: req.body.url,
    pagesRead: pagesRead,
    totalPages: totalPages,
    status: req.body.status,
    dueDate: req.body.dueDate,
    notes: req.body.notes,
    percentComplete: Math.round((pagesRead / totalPages) * 100),
  };

  readings[readingIndex] = updatedReading;

  res.json(updatedReading);
});

app.delete("/api/readings/:id", (req, res) => {
  const readingIndex = readings.findIndex(
    (reading) => reading._id === req.params.id
  );

  if (readingIndex === -1) {
    return res.status(404).json({ error: "Reading not found" });
  }

  const deletedReading = readings.splice(readingIndex, 1);

  res.json(deletedReading[0]);
});

async function startServer() {
  try {
    await client.connect();

    db = client.db("pluna");

    console.log("Connected to MongoDB");

    ViteExpress.listen(app, 3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
startServer();