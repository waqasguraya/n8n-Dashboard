"use client";

import { useState } from "react";
import { getSupabaseClient } from "../lib/supabase.js";

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
      if (!form.name || !form.email || !form.role) {
        alert("Please fill all fields");
        return;
      }

      setLoading(true);

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
        const supabase = getSupabaseClient();
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_.25s_ease]">

        {/* 🔥 Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5 text-white">
          <h2 className="text-lg sm:text-xl font-semibold">Add New User</h2>
          <p className="text-xs sm:text-sm opacity-90">
            Create a new team member
          </p>
        </div>

        <div className="p-4 sm:p-6 relative">

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-700 text-lg"
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
                  className="w-full py-2 outline-none text-sm sm:text-base"
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
                  className="w-full py-2 outline-none text-sm sm:text-base"
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
                  className="w-full py-2 outline-none bg-transparent text-sm sm:text-base"
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
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}