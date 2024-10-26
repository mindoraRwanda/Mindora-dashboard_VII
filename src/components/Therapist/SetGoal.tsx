import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

// Define the User interface
interface User {
  id: number;
  action: string;
  name: string;
  email: string;
  lastLogin: string;
  status: string;
}

// Modal component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded shadow-lg">
        {children}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
          Close
        </button>
      </div>
    </div>
  );
};

export default function SetGoal() {
  // Initial list of users
  const initialUsers: User[] = [
    { id: 1, action: 'Visiting patients', name: "John Doe", email: "2024-07-10", lastLogin: "2024-07-18", status: "AHEAD" },
    { id: 2, action: "Testing patients", name: "Jane Smith", email: "2024-07-21", lastLogin: "2024-07-29", status: "ON TRACK" },
    { id: 3, action: "Checking patient and report", name: "Bob Johnson", email: "2024-08-11", lastLogin: "2024-08-01", status: "ENDING" },
  ];

  // State to manage the list of users and the user being edited or created
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({ id: 0, action: '', name: '', email: '', lastLogin: '', status: 'ON TRACK' });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Function to handle the "Edit" button click
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Function to handle the "Add" button click
  const handleAddClick = () => {
    setNewUser({ id: users.length + 1, action: '', name: '', email: '', lastLogin: '', status: 'ON TRACK' });
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Function to handle changes in the form inputs
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  // Function to save the edited user details
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null);
    } else {
      setUsers([...users, newUser]);
      setNewUser({ id: 0, action: '', name: '', email: '', lastLogin: '', status: 'ON TRACK' });
    }
    setIsModalOpen(false);
  };

  // Function to handle the "Delete" button click
  const handleDeleteClick = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Goals</h2>
      <button
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-800 transition-colors"
        onClick={handleAddClick}
      >
        Add New Goal
      </button>
      <table className="min-w-full mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Responsible
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Starting Date
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Ending Date
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="odd:bg-white even:bg-gray-100 hover:bg-gray-200 transition-colors">
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">{user.action}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">{user.lastLogin}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">{user.status}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 flex space-x-3">
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 transition-colors"
                  title="View more"
                  onClick={() => handleEditClick(user)}
                >
                  <FaEye className="mr-1" />
                  View
                </button>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-purple-500 hover:bg-purple-700 transition-colors"
                  title="Edit"
                  onClick={() => handleEditClick(user)}
                >
                  <FaEdit className="mr-1" />
                  Edit
                </button>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-300 hover:bg-gray-600 transition-colors"
                  title="Delete"
                  onClick={() => handleDeleteClick(user.id)}
                >
                  <FaTrash className="mr-1" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-2">{editingUser ? "Edit Goal" : "Add New Goal"}</h3>
        <form onSubmit={handleSave}>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Action
              <input
                type="text"
                name="action"
                value={editingUser ? editingUser.action : newUser.action}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Responsible
              <input
                type="text"
                name="name"
                value={editingUser ? editingUser.name : newUser.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Starting Date
              <input
                type="date"
                name="email"
                value={editingUser ? editingUser.email : newUser.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Ending Date
              <input
                type="date"
                name="lastLogin"
                value={editingUser ? editingUser.lastLogin : newUser.lastLogin}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
              <select
                name="status"
                value={editingUser ? editingUser.status : newUser.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="ON TRACK">ON TRACK</option>
                <option value="AHEAD">AHEAD</option>
                <option value="ENDING">ENDING</option>
              </select>
            </label>
          </div>
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
}
