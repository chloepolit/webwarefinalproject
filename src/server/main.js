import express from  'express'
import ViteExpress from 'vite-express'

const app = express()
const readings = [];

app.use(express.json());

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

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);

ViteExpress.listen( app, 3000 )