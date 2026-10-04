import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "job-applications";
const statuses = ["applied", "interview", "rejected", "withdraw", "offer"];

const emptyApplication = {
  company: "",
  role: "",
  dateApplied: "",
  resume: "",
  status: "applied",
};

function applicationAge(dateApplied) {
  const oneDay = 1000*60*60*24;
  const appliedDate = new Date(`${dateApplied}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - appliedDate)/oneDay);

  if (diffDays < 0 || Number.isNaN(diffDays)) {
    return "Invalid date";
    }
  if (diffDays === 0) {
    return "Today";}
  if (diffDays === 1) {
    return "1 day ago";
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;}
  if (diffDays < 365)
    {return `${Math.floor(diffDays / 30)} months ago`;}
  return `${Math.floor(diffDays / 365)} years ago`;
}

function App() {
  const [applications, setApplications] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState(emptyApplication);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    setApplications((current) => [
      ...current,
      { ...form, id: crypto.randomUUID() },
    ]);
    setForm(emptyApplication);
    setMessage("Application added successfully!");
  }

  function updateStatus(id, status) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id
          ? { ...application, status, pendingStatus: undefined }
          : application,
      ),
    );
    setMessage("Application updated successfully!");
  }

  function deleteApplication(id) {
    setApplications((current) =>
      current.filter((application) => application.id !== id),
    );
    setMessage("Application deleted successfully!");
  }

  return (
    <div>
      <h1 className="text-center my-4">Job Application Tracker</h1>

      <main className="container card p-4 mb-4">
        <section className="form-section mb-4">
          <h2>Add a new application</h2>
          <p>Track &amp; manage your job applications easily!</p>

          <form onSubmit={submit}>
            <label htmlFor="company">Company Name (required): </label>
            <input
              type="text"
              id="company"
              name="company"
              className="form-control"
              value={form.company}
              onChange={updateForm}
              required
            />
            <br />

            <label htmlFor="role">Role (required): </label>
            <input
              type="text"
              id="role"
              name="role"
              className="form-control"
              value={form.role}
              onChange={updateForm}
              required
            />
            <br />

            <label htmlFor="date-applied">Date Applied (required): </label>
            <input
              type="date"
              id="date-applied"
              name="dateApplied"
              className="form-control"
              value={form.dateApplied}
              onChange={updateForm}
              required
            />
            <br />

            <label htmlFor="resume">Resume:</label>
            <input
              type="text"
              id="resume"
              name="resume"
              className="form-control"
              value={form.resume}
              onChange={updateForm}
            />
            <br />

            <label htmlFor="status">Current Status (required):</label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={form.status}
              onChange={updateForm}
            >
              <option value="applied">Applied</option>
              <option value="interview">Interviewing</option>
              <option value="rejected">Rejected</option>
              <option value="withdraw">Withdrawn</option>
              <option value="offer">Offer</option>
            </select>
            <br />

            <button type="submit" className="btn btn-primary">
              Add Application
            </button>
            <p className="mt-3" role="status" aria-live="polite">
              {message}
            </p>
          </form>
        </section>

        <section className="results-section mb-4">
          <h2>Your Applications</h2>
          {applications.length === 0 ? (
            <p>No results to show</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <caption>Your saved job applications</caption>
                <thead>
                  <tr>
                    <th scope="col">Company</th>
                    <th scope="col">Role</th>
                    <th scope="col">Date Applied</th>
                    <th scope="col">Resume</th>
                    <th scope="col">Status</th>
                    <th scope="col">Application Age</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td>{application.company}</td>
                      <td>{application.role}</td>
                      <td>{application.dateApplied}</td>
                      <td>{application.resume}</td>
                      <td>
                        <label
                          className="visually-hidden"
                          htmlFor={`status-${application.id}`}
                        >
                          Status for {application.company}
                        </label>
                        <select
                          id={`status-${application.id}`}
                          className="form-select"
                          value={application.pendingStatus || application.status}
                          onChange={(event) => {
                            const nextStatus = event.target.value;
                            setApplications((current) =>
                              current.map((currentApplication) =>
                                currentApplication.id === application.id
                                  ? {
                                      ...currentApplication,
                                      pendingStatus: nextStatus,
                                    }
                                  : currentApplication,
                              ),
                            );
                          }}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{applicationAge(application.dateApplied)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            updateStatus(
                              application.id,
                              application.pendingStatus || application.status,
                            )
                          }
                          aria-label={`Update application for ${application.company}`}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteApplication(application.id)}
                          aria-label={`Delete application for ${application.company}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
