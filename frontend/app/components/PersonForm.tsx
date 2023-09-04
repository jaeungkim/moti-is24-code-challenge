import React, { useState } from "react";

const PersonForm = ({
  onSubmit,
  error,
}: {
  onSubmit: Function;
  error: string | null;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contactDetails: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="name" className="text-lg font-semibold">
          Name:
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />
      </div>
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
        <label htmlFor="contactDetails" className="text-lg font-semibold">
          Contact Details:
        </label>
        <input
          id="contactDetails"
          type="text"
          name="contactDetails"
          value={formData.contactDetails}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
      {error && <div className="error text-red-500 font-semibold">{error}</div>}
    </form>
  );
};

export default PersonForm;
