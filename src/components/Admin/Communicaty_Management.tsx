import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdArchive } from "react-icons/io";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";

export default function Communication() {
  const Users = [
    {
      id: 1,
      name: "Placide",
      email: "john@example.com",
      gender: "Male",
      role: "Admin",
      lastLogin: "2024-07-18",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      gender: "female",
      role: "therapy",
      lastLogin: "2024-07-17",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      gender: "Male",
      role: "User",
      lastLogin: "2024-07-16",
    },
  ];

  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleInput = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className="ml-6">
      <h4 className="text-purple-600 text-2xl font-semibold my-4">
        Community Management
      </h4>
      <div className="flex gap-10">
        <div className="p-3 border-2 border-gray-400 rounded-md">
          <img src="/Images/beauty1.jpg" alt="com" width={100} height={100} className="rounded-full ml-5" /><br />
          <p className="text-black text-xl font-semibold">Therapists Group</p>
        </div>
        <div className="p-3 border-2 border-gray-400 rounded-md">
          <img src="/Images/beauty9.jpg" alt="com" width={100} height={100} className="rounded-full ml-3" /><br />
          <p className="text-black text-xl font-semibold">Users Group</p>
        </div>
      </div>
      <div className="flex gap-5 mt-3">
        <div className="w-1/3 border-2 border-gray-300 rounded-lg bg-white">
          <h3 className="text-purple-600 font-semibold mx-4 my-2 text-xl">
            Therapist Community Messages
          </h3>
          <hr className="text-black border border-gray-400" />
          <table className="min-w-full">
            <thead>
              <tr className="gap-4">
                <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                  Name
                </th>
                <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                  Messages
                </th>
              </tr>
            </thead>
            <tbody>
              {Users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      <h4 className="text-black text-xl font-serif my-3 mx-1">
                        Tomorrow at 12:00 PM we have a meeting, and it's very
                        important for everyone to be there. Don't plan to miss.
                      </h4>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6">
            <textarea
              name="messages"
              id="messages"
              cols="53"
              rows="2"
              placeholder="Text Announcement here"
              className="border border-slate-400 mx-2 mt-4 p-2 text-black bg-gray-200 rounded-lg"
              style={{ resize: "none", overflow: "hidden" }}
              ref={textareaRef}
              value={message}
              onInput={handleInput}
            />
            <div className="flex justify-end mx-2 mb-4">
              <button className="bg-purple-600 text-white font-semibold px-3 mr-2 py-1 rounded hover:bg-purple-700">
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="w-2/3 border-2 border-gray-300 rounded-lg bg-white">
          <h3 className="text-purple-600 text-xl mx-4 my-2 font-semibold">
            Messages | Announcement
          </h3>
          <hr className="text-black border border-gray-400" />
          <table className="min-w-full">
            <thead>
              <tr className="gap-4">
                <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                  Name
                </th>
                <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                  Messages
                </th>
                <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                  Actions
                </th>
                <th className="text-black capitalize text-md leading-5 text-left px-2 py-3">
                  Admit|Ignore
                </th>
              </tr>
            </thead>
            <tbody>
              {Users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      <h4 className="text-black text-xl font-serif my-3 mx-1">
                        Tomorrow at 12:00 PM we have a meeting, and it's very
                        important for everyone to be there. Don't plan to miss.
                      </h4>
                    </div>
                  </td>
                  <td className="flex gap-2 mt-12">
                    <button><MdDelete size={24} color="red" /></button>
                    <button><MdEdit size={24} color="blue" /></button>
                    <button><IoMdArchive size={24} color="black" /></button>
                  </td>
                  <td>
                    <button className="font-sans flex float-right mr-2 mb-6 font-semibold p-1 rounded-md bg-purple-600 text-white">
                      <IoCheckmarkDoneSharp size={23} /> Admit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
