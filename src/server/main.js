import express from "express";
import ViteExpress from "vite-express";

const app = express();
const applications = [];

app.use(express.json());

app.get("/api/applications", (req, res) => {
  res.json(applications);
});

app.post("/api/applications", (req, res) => {
  const { company, role, dateApplied, resume, status } = req.body;

  if (!company || !role || !dateApplied || !status) {
    return res.status(400).json({
      error: "Company, role, date applied, and status are required.",
    });
  }

  const application = {
    id: Date.now().toString(),
    company,
    role,
    dateApplied,
    resume: resume || "",
    status,
  };

  applications.push(application);
  res.status(201).json(application);
});

app.put("/api/applications/:id", (req, res) => {
  const applicationIndex = applications.findIndex(
    (application) => application.id === req.params.id,
  );

  if (applicationIndex === -1) {
    return res.status(404).json({ error: "Application not found." });
  }

  const application = applications[applicationIndex];
  application.status = req.body.status;
  res.json(application);
});

app.delete("/api/applications/:id", (req, res) => {
  const applicationIndex = applications.findIndex(
    (application) => application.id === req.params.id,
  );

  if (applicationIndex === -1) {
    return res.status(404).json({ error: "Application not found." });
  }

  const [deletedApplication] = applications.splice(applicationIndex, 1);
  res.json(deletedApplication);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
