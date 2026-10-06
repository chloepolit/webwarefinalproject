import React, { useState, useEffect } from "react";
import ReadingForm from "./ReadingForm";
import ReadingList from "./ReadingList";
import "./ReadingTracker.css";

function ReadingTracker() {
  const [readings, setReadings] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/readings")
      .then((response) => response.json())
      .then((data) => {
        setReadings(data);
      });
  }, []);

  const addReading = (newReading) => {
    fetch("/api/readings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReading),
    })
      .then((response) => response.json())
      .then((data) => {
        setReadings([...readings, data]);
        setShowForm(false);
      });
  };

  const updateReading = (updatedReading) => {
    fetch("/api/readings/" + updatedReading._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedReading),
    })
      .then((response) => response.json())
      .then((data) => {
        setReadings(
          readings.map((reading) => (reading._id === data._id ? data : reading))
        );
      });
  };

  const deleteReading = (id) => {
    fetch("/api/readings/" + id, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setReadings(readings.filter((reading) => reading._id !== id));
      }
    });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Reading Tracker</h1>
          <p className="text-muted mb-0">
            Keep track of your assigned readings, deadlines, and progress.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Reading
        </button>
      </div>

      <ReadingForm
        show={showForm}
        onClose={() => setShowForm(false)}
        onAdd={addReading}
      />

      <ReadingList
        readings={readings}
        onUpdate={updateReading}
        onDelete={deleteReading}
      />
    </div>
  );
}

export default ReadingTracker;