import express from "express";
import ViteExpress from "vite-express";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";
import bcrypt from "bcrypt";

const app = express();

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

app.get("/api/readings", async (req, res) => {
  try {
    const userId = req.query.userId;

    const readings = await db
      .collection("readings")
      .find({ userId: userId })
      .toArray();

    res.json(readings);
  } catch (error) {
    console.error("Error getting readings:", error);
    res.status(500).json({ error: "Could not get readings." });
  }
});

app.post("/api/readings", async (req, res) => {
  try {
    const newReading = {
      userId: req.body.userId,
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

    const result = await db.collection("readings").insertOne(newReading);

    newReading._id = result.insertedId;

    res.json(newReading);
  } catch (error) {
    console.error("Error adding reading:", error);
    res.status(500).json({ error: "Could not add reading." });
  }
});

app.put("/api/readings/:id", async (req, res) => {
  try {
    const pagesRead = Number(req.body.pagesRead);
    const totalPages = Number(req.body.totalPages);

    const updatedReading = {
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

    const result = await db
      .collection("readings")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id)},
        { $set: updatedReading },
        { returnDocument: "after" }
      );

    if (!result) {
      return res.status(404).json({ error: "Reading not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating reading:", error);
    res.status(500).json({ error: "Could not update reading." });
  }
});

app.delete("/api/readings/:id", async (req, res) => {
  try {
    const result = await db.collection("readings").deleteOne({
      _id: new ObjectId(req.params.id), userId: req.query.userId,
    });

    if (result.deleteCount === 0) {
      return res.status(404).json({ error: "Reading not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting reading:", error);
    res.status(500).json({ error: "Could not delete reading." });
  }
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