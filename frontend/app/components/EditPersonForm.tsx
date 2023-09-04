import React, { useState, useEffect } from "react";
import axios from "axios";

const EditPersonForm = ({ onClose, personId, onSubmit, error }: any) => {
  const [formData, setFormData] = useState({ age: "", contactDetails: "" });

  useEffect(() => {
    console.log(personId);
    if (personId) {
      axios
        .get(`http://localhost:3030/api/person/${personId}`)
        .then((response) => {
          setFormData({
            age: response.data.age,
            contactDetails: response.data.contactDetails,
          });
        })
        .catch((error) => console.error("Could not fetch data:", error));
    }
  }, [personId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onSubmit(formData, personId);
  };

  return (
    <div className="edit-form-modal">
      <h3 className="text-lg font-semibold">Edit Person</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="age" className="text-lg font-semibold">
            Age:
          </label>
          <input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="contact" className="text-lg font-semibold">
            Contact:
          </label>
          <input
            id="contact"
            type="text"
            name="contact"
            value={formData.contactDetails}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-red-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      </form>
      {error && <div className="error text-red-500 font-semibold">{error}</div>}
    </div>
  );
};

export default EditPersonForm;
