import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../Redux/slice/Patients";

const PatientList = () => {
  const dispatch = useDispatch();
  const { data: patients, loading, error } = useSelector((state) => state.patients);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  console.log(patients)

  if (loading) return <p className="text-black text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">Error: {error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Patient List</h2>
      {patients.length === 0 ? (
        <p className="text-center text-gray-600">No patients available.</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-gray-800">Age</th>
              <th className="px-6 py-3 border-b text-left text-gray-800">Condition</th>
              <th className="px-6 py-3 border-b text-left text-gray-800">Gender</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-100">
                <td className="px-6 text-black py-4 border-b text-gray-800">{patient.personalInformation.age}</td>
                <td className="px-6 text-black py-4 border-b text-gray-800">{patient.medicalProfile.condition}</td>
                <td className="px-6 text-black py-4 border-b text-gray-800">{patient.personalInformation?.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientList;
