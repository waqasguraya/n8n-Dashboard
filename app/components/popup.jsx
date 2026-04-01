import { useState } from "react";
import { PassThrough } from "stream";

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

 const handleSubmit = async () => {
  const payload = {
    username: form.name,
    email: form.email,
    name: form.name,

    // If you want to send role, add: role: form.role
  };
  try {
    const res = await fetch('/api/jira', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      alert('User created successfully!');
      setOpen(false);
    } else {
      alert('Failed to create user: ' + (data.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Failed to create user: ' + err.message);
  }
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
              <option value="Manager">Manager</option>
              <option value="Technical Lead">Technical Lead</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Intern Frontend Developer">Intern Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Intern Backend Developer">Intern Backend Developer</option>
              <option value="HR and Accountant">HR and Accountant</option>
              <option value="Web Developer">Web Developer</option>
              <option value="Intern Web Developer">Intern Web Developer</option>
              <option value="Graphic Designer">Graphic Designer</option>
              <option value="Go (Golang) Developer">Go (Golang) Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Intern UI/UX Designer">Intern UI/UX Designer</option>
              <option value="Backend Developer / Technical Officer">Backend Developer / Technical Officer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Intern Full Stack Developer">Intern Full Stack Developer</option>
              <option value="Software Testing / QA Engineer">Software Testing / QA Engineer</option>
              <option value="Business Development & Innovation Executive">Business Development & Innovation Executive</option>
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