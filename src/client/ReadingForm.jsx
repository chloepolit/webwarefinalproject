import React, { useState } from "react";

function ReadingForm({ show, onClose }) {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        course: "",
        type: "Textbook",
        url: "",
        pagesRead: "",
        totalPages: "",
        status: "Not Started",
        dueDate: "",
        notes: "",
    });

    if (!show) {
        return null;
    }

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <div className="modal-header">
                        <h2 className="modal-title fs-5">Add Reading</h2>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>

                    <form>
                        <div className="modal-body">
                            <p className="text-muted">
                                Fields marked with * are required.
                            </p>

                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    placeholder="Reading title"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="author" className="form-label">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    className="form-control"
                                    placeholder="Author"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="course" className="form-label">
                                    Class / Course *
                                </label>
                                <input
                                    type="text"
                                    id="course"
                                    className="form-control"
                                    placeholder="Example: CS 4241"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="type" className="form-label">
                                    Type *
                                </label>
                                <select id="type" className="form-select" required>
                                    <option value="Textbook">Textbook</option>
                                    <option value="Book">Book</option>
                                    <option value="Article">Article</option>
                                    <option value="Research Paper">Research Paper</option>
                                    <option value="Chapter">Chapter</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="url" className="form-label">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    id="url"
                                    className="form-control"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="pagesRead" className="form-label">
                                        Pages Read *
                                    </label>
                                    <input
                                        type="number"
                                        id="pagesRead"
                                        className="form-control"
                                        min="0"
                                        placeholder="0"
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="totalPages" className="form-label">
                                        Total Pages *
                                    </label>
                                    <input
                                        type="number"
                                        id="totalPages"
                                        className="form-control"
                                        min="1"
                                        placeholder="100"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">
                                    Status *
                                </label>
                                <select id="status" className="form-select" required>
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="dueDate" className="form-label">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="notes" className="form-label">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Assignment details, chapters to read, reminders, etc."
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button type="submit" className="btn btn-primary">
                                Add Reading
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default ReadingForm;