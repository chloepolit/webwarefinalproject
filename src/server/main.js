import express from "express";
import ViteExpress from "vite-express";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();

app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let db;

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