import React, { useState } from "react";
import ReadingForm from "./ReadingForm";
import ReadingList from "./ReadingList";

function ReadingTracker() {
  const [readings, setReadings] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addReading = (newReading) => {
    setReadings([...readings, newReading]);
    setShowForm(false);
  };

  const updateReading = (updatedReading) => {
    setReadings(
      readings.map((reading) =>
        reading._id === updatedReading._id ? updatedReading : reading
      )
    );
  };

  const deleteReading = (id) => {
    setReadings(readings.filter((reading) => reading._id !== id));
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