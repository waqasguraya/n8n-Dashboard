"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function AddUserModal({ open, setOpen }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.role) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/jira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          name: form.name,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const { error } = await supabase.from("Users").insert([
          {
            name: form.name,
            email: form.email,
            role: form.role,
            status: "active",
            joined: new Date().toISOString(),
          },
        ]);

        if (error) throw error;

        alert("User created successfully!");
        setOpen(false);
        setForm({ name: "", email: "", role: "" });
      } else {
        alert(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_.25s_ease]">

        {/* 🔥 Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
          <h2 className="text-xl font-semibold">Add New User</h2>
          <p className="text-sm opacity-90">
            Create a new team member
          </p>
        </div>

        <div className="p-6 relative">

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>

          {/* Form */}
          <div className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-xs text-gray-500">Full Name</label>
              <div className="flex items-center border rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="text-gray-400 mr-2">👤</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full py-2 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500">Email Address</label>
              <div className="flex items-center border rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="text-gray-400 mr-2">📧</span>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full py-2 outline-none"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-xs text-gray-500">Role</label>
              <div className="flex items-center border rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="text-gray-400 mr-2">💼</span>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full py-2 outline-none bg-transparent"
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
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:opacity-90 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Save User"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}