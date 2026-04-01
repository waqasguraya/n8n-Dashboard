"use client";

import { useState, useEffect } from "react";

export default function EditUserModal({ open, setOpen, user, updateUser, deleteUser }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        status: user.status || "active",
      });
    }
  }, [user]);

  if (!open || !user) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.role || !form.status) return;
    updateUser(user.id, form);
    setOpen(false);
  };

  const handleDelete = () => {
    deleteUser(user.id);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">

      {/* Modal */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_.2s_ease]">

        {/* 🔥 HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
          <h2 className="text-xl font-semibold">Edit User</h2>
          <p className="text-sm opacity-90">
            Update team member details
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 relative">

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>

          <div className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-xs text-gray-500">Full Name</label>
              <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                <span className="text-gray-400 mr-2">👤</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full py-2 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500">Email Address</label>
              <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                <span className="text-gray-400 mr-2">📧</span>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full py-2 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-xs text-gray-500">Role</label>
              <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                <span className="text-gray-400 mr-2">💼</span>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full py-2 bg-transparent outline-none"
                >
                  <option value="">Select role</option>
                  <option>Manager</option>
                  <option>Technical Lead</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>UI/UX Designer</option>
                  <option>Full Stack Developer</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs text-gray-500">Status</label>
              <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                <span className="text-gray-400 mr-2">📊</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full py-2 bg-transparent outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex justify-between items-center mt-6">

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition active:scale-95 shadow-sm"
            >
              Delete
            </button>

            {/* Right */}
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:opacity-90 transition active:scale-95"
              >
                Save User
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}