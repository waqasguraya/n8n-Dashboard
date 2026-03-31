import { useState } from "react";

export default function AddUserModal({ open, setOpen, addUser }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.role) return;

    addUser({
      ...form,
      status: "active",
      joined: new Date().toISOString().split("T")[0],
    });

    setForm({ name: "", email: "", role: "" });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">

        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold">Add New User</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter the details of the new user.
        </p>

        {/* Form */}
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="John Doe"
              className="w-full bg-gray-100 p-2 rounded-md outline-none mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="john@example.com"
              className="w-full bg-gray-100 p-2 rounded-md outline-none mt-1"
            />
          </div>

          {/* Role (Dropdown) */}
          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-gray-100 p-2 rounded-md outline-none mt-1"
            >
              <option value="">Select role</option>
              <option value="Intern Web Developer">Intern Web Developer</option>
              <option value="Admin">Admin</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Intern Backend Developer">Intern Backend Developer</option>
              <option value="Intern Frontend Developer">Intern Frontend Developer</option>
              <option value="HR and Sales Support">HR and Sales Support</option>
              <option value="CEO">CEO</option>
              <option value="Runner (Office Boy)">Runner (Office Boy)</option>
              <option value="Trainee Frontend Developer">Trainee Frontend Developer</option>
              <option value="Accountant">Accountant</option>
              <option value="Chief Technical Officer">Chief Technical Officer</option>
              <option value="Backend Developer / Technical Officer">Backend Developer / Technical Officer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Intern Full Stack Developer">Intern Full Stack Developer</option>
              <option value="Sales and Admin Lead (Director)">Sales and Admin Lead (Director)</option>
              <option value="Technical Lead / Scrum Master">Technical Lead / Scrum Master</option>


            </select>
          </div>

        </div>

        {/* Button */}
        <div className="flex justify-end mt-5">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
          >
            Save User
          </button>
        </div>
      </div>
    </div>
  );
}