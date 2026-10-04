import React, { useState, useEffect } from 'react';
import ReadingForm from './ReadingForm';
import ReadingList from './ReadingList';

function ReadingTracker() {
    const [readings, setReadings] = useState([]);
    const [showForm, setShowForm] = useState(false);

    return (
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>Reading Tracker</h1>
            <p className="text-muted mb-0">
              Keep track of your assigned readings, deadlines, and progress.
            </p>
          </div>
  
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add Reading
          </button>
        </div>
  
        <ReadingForm
          show={showForm}
          onClose={() => setShowForm(false)}
        />
  
        <ReadingList readings={readings} />
      </div>
    );
}
  
export default ReadingTracker;