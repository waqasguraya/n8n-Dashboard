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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">

        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold">Edit User</h2>
        <p className="text-sm text-gray-500 mb-4">
          Update the details of the user.
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

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-gray-100 p-2 rounded-md outline-none mt-1"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-5">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}