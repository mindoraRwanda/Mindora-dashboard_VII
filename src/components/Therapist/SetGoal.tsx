import React, { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Modal } from "antd";

interface User {
  id: number;
  action: string;
  name: string;
  MilestoneDate: string;
  TaskDate: string;
  status: string;
}

export default function SetGoal() {
  // Initial list of users
  const initialUsers: User[] = [
    {
      id: 1,
      action: "Visiting patients",
      name: "John Doe",
      Milestonedate: "2024-07-10",
      TaskDate: "2024-07-18",
      status: "AHEAD",
    },
    {
      id: 2,
      action: "Testing patients",
      name: "Jane Smith",
      MilestoneDate: "2024-07-21",
      TaskDate: "2024-07-29",
      status: "ON TRACK",
    },
    {
      id: 3,
      action: "Checking patient and report",
      name: "Bob Johnson",
      MilestoneDate: "2024-08-11",
      TaskDate: "2024-08-01",
      status: "ENDING",
    },
  ];

  // State to manage the list of users and the user being edited or created
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (user:user|null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 border">
      <table className="min-w-full ">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Patient Names
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Plan
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              MilestoneDate
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Task Date
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Milestone Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Task Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="odd:bg-white even:bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                  {user.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                  {user.action}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {user.MilestoneDate}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {user.TaskDate}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {user.status}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {user.status}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 flex space-x-3">
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-transparent  leading-5 font-medium rounded text-white bg-purple-600 hover:bg-blue-700 transition-colors"
                  title="View more"
                  onClick={()=>showModal(user)}
                >
                  <FaEye className="mr-1" />
                  View
                </button>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-purple-600 text-sm leading-5 font-medium rounded text-black bg-transparent hover:bg-white transition-colors"
                  title="Edit"
                  onClick={()=>showModal(user)}
                >
                  <FaEdit className="mr-1 text-purple-900" />
                  Edit
                </button>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-red-500 text-sm leading-5  rounded text-black bg-transparent hover:bg-white transition-colors"
                  title="Delete"
                >
                  <FaTrash className="mr-1 text-red-500" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal visible={isModalOpen} footer={null} onCancel={handleCancelModal}>
        <h3 className="text-xl font-semibold mb-2">
          {editingUser ? "Edit Goal" : "Add New Goal"}
        </h3>
        <form>
          <div className="my-3">
            <label className="block text-sm font-medium text-gray-700">
              Action
              <input
                type="text"
                name="action"
                value={editingUser?.action}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 "
                
               
              />
            </label>
          </div>
          <div className="my-3">
            <label className="block text-sm font-medium text-gray-700">
              Responsible
              <input
                type="text"
                name="name"
                value={editingUser?.name}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
           
              />
            </label>
          </div>
          <div className="my-3">
            <label className="block text-sm font-medium text-gray-700">
              Starting Date
              <input
                type="date"
                name="MilestoneDate"
                value={editingUser?.MilestoneDate}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </label>
          </div>
          <div className="my-3">
            <label className="block text-sm font-medium text-gray-700">
              Ending Date
              <input
                type="date"
                name="TaskDate"
                value={editingUser?.TaskDate}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          
              />
            </label>
          </div>
          <div className="my-3">
            <label className="block text-sm font-medium text-gray-700">
              Status
              <select
                name="status"
                value={editingUser?.status}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="ON TRACK">ON TRACK</option>
                <option value="AHEAD">AHEAD</option>
                <option value="ENDING">ENDING</option>
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="mt-2 px-4  text-md w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-800 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
}
