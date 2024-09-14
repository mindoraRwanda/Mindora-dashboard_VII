import React, { useState } from 'react';

export default function CreatePatient({ addPatient }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = () => {
    const newPatient = {
      name,
      email,
      lastLogin: new Date().toISOString().split("T")[0],
      age,
      gender,
    };

    addPatient(newPatient);
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded p-6 shadow-lg">
        <p className="text-black mb-8 text-center text-xl font-semibold">
          Create New Patient
        </p>

        <div className="grid grid-cols-1 gap-4">
          <div className="mb-4">
            <label className="font-semibold text-sm mb-2 block">Name:</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-blue-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-sm mb-2 block">Email:</label>
            <input
              type="email"
              className="w-full p-2 rounded border border-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-sm mb-2 block">Age:</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-blue-600"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold text-sm mb-2 block">Gender:</label>
            <div>
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                  className="mr-2"
                />
                Male
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                  className="mr-2"
                />
                Female
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Others"
                  checked={gender === 'Others'}
                  onChange={(e) => setGender(e.target.value)}
                  className="mr-2"
                />
                Others
              </label>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white p-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
