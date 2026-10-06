import express from "express";

const router = express.Router();
const applications = [];

router.get("/", (req, res) => {
  res.json(applications);
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  const applicationIndex = applications.findIndex(
    (application) => application.id === req.params.id,
  );

  if (applicationIndex === -1) {
    return res.status(404).json({ error: "Application not found." });
  }

  const [deletedApplication] = applications.splice(applicationIndex, 1);
  res.json(deletedApplication);
});

export default router;
