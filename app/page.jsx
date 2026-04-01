"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "./lib/supabase";
import User from "../user.svg";
import Popup from "./components/popup";
import EditPopup from "./components/editPopup";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("Users").select("*");
      if (error) {
        console.error("Fetch users error:", error);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  const addUser = async (newUser) => {
    const { data, error } = await supabase.from("Users").insert([newUser]);
    if (error) {
      console.error("Insert user error:", error);
      return;
    }
    // Create user in Jira
    try {
      const jiraRes = await fetch('/api/jira', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!jiraRes.ok) {
        const errorText = await jiraRes.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = errorText;
        }
        console.error("Jira create user error:", error);
      } else {
        console.log("User created in Jira successfully");
      }
    } catch (err) {
      console.error("Jira fetch error:", err);
    }
    const { data: updatedData, error: fetchError } = await supabase.from("Users").select("*");
    if (!fetchError) {
      setUsers(updatedData);
    }
  };

  const deleteUser = async (userId) => {
    const { error } = await supabase.from("Users").delete().eq('id', userId);
    if (error) {
      console.error("Delete user error:", error);
      return;
    }
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const updateUser = async (userId, updatedData) => {
    const { error } = await supabase.from("Users").update(updatedData).eq('id', userId);
    if (error) {
      console.error("Update user error:", error);
      return;
    }
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, ...updatedData } : user))
    );
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src={User} alt="user" width={40} height={40} />
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">User Dashboard</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Manage and add users to your system
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Add New User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
          {[
            { title: "Total Users", value: totalUsers },
            { title: "Active Users", value: activeUsers },
            { title: "Inactive Users", value: inactiveUsers },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl shadow">
              <p className="text-gray-500 text-xs sm:text-sm">{item.title}</p>
              <p className="text-xl sm:text-2xl font-semibold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white mt-6 rounded-2xl shadow overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3">Name</th>
                <th className="text-left px-4 sm:px-6 py-3">Email</th>
                <th className="text-left px-4 sm:px-6 py-3">Role</th>
                <th className="text-left px-4 sm:px-6 py-3">Status</th>
                <th className="text-left px-4 sm:px-6 py-3">Joined</th>
                <th className="text-left px-4 sm:px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-4 sm:px-6 py-4">{user.name}</td>
                  <td className="px-4 sm:px-6 py-4">{user.email}</td>
                  <td className="px-4 sm:px-6 py-4">{user.role}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`text-xs px-2 sm:px-3 py-1 rounded-full ${
                        user.status === "active"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">{user.joined}</td>
                  <td className="px-4 sm:px-6 py-4 flex gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Popup open={open} setOpen={setOpen} addUser={addUser} />

        <EditPopup
          open={editingUser !== null}
          setOpen={() => setEditingUser(null)}
          user={editingUser}
          updateUser={updateUser}
          deleteUser={deleteUser}
        />

      </div>
    </div>
  );
}