"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "./lib/supabase";
import User from "../user.svg";
import Popup from "./components/popup";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Fetch users error:", error);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  const addUser = async (newUser) => {
    const { data, error } = await supabase.from("users").insert([newUser]);
    if (error) {
      console.error("Insert user error:", error);
      return;
    }
    setUsers((prev) => [...prev, data[0]]);
  };

  // Compute user counts dynamically
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src={User} alt="user" width={35} height={35} />
            <div>
              <h1 className="text-3xl font-bold">User Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage and add users to your system
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Add New User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {[
            { title: "Total Users", value: totalUsers },
            { title: "Active Users", value: activeUsers },
            { title: "Inactive Users", value: inactiveUsers },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
            >
              <p className="text-gray-500 text-sm">{item.title}</p>
              <p className="text-2xl font-semibold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white mt-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Name</th>
                <th className="text-left px-6 py-3 font-medium">Email</th>
                <th className="text-left px-6 py-3 font-medium">Role</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Joined</th>
                <th className="text-left px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        user.status === "active"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.joined}</td>
                  <td className="px-6 py-4 text-red-500 cursor-pointer hover:scale-110 transition">
                    🗑
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        <Popup open={open} setOpen={setOpen} addUser={addUser} />

      </div>
    </div>
  );
}