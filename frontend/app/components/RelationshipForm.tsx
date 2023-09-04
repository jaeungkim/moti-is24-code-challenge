import { useState } from "react";

const RelationshipForm = ({
  people,
  onSubmit,
  serverError,
}: {
  people: any[];
  onSubmit: Function;
  serverError: string | null;
}) => {
  const [formData, setFormData] = useState({
    person1: "",
    person2: "",
    relationshipType: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const { person1, person2, relationshipType } = formData;

    // Check if any required field is empty
    if (!person1 || !person2 || !relationshipType) {
      setError("All fields are required.");
      return;
    }

    setError(""); // Clear any previous error
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label className="text-lg font-semibold">
          Person 1:
          <select
            className="border rounded p-2"
            name="person1"
            onChange={handleChange}
            required
          >
            <option value="">Select a person</option>
            {people.map((person: any, index: any) => (
              <option key={index} value={person.data.name}>
                {person.data.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-lg font-semibold">
          Person 2:
          <select
            className="border rounded p-2"
            name="person2"
            onChange={handleChange}
            required
          >
            <option value="">Select a person</option>
            {people.map((person: any, index: any) => (
              <option key={index} value={person.data.name}>
                {person.data.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-semibold">
          Relationship Type:
          <select
            className="border rounded p-2"
            name="relationshipType"
            onChange={handleChange}
            required
          >
            <option value="">Select a relationship type</option>
            <option value="parent">Parent</option>
            <option value="child">Child</option>
            <option value="partner">Partner</option>
            <option value="friend">Friend</option>
          </select>
        </label>
      </div>

      <div className="flex gap-4">
        {" "}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {serverError && <p style={{ color: "red" }}>{serverError}</p>}
      </div>
    </form>
  );
};

export default RelationshipForm;
