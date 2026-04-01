"use client";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase.js";
import AddUserModal from "./components/popup.jsx";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('Users').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    };
    fetchUsers();
  }, []);

  const updateUser = (id, updatedData) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u)));
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const addUser = (newUser) => {
    setUsers((prev) => [...prev, { id: Date.now(), ...newUser }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          
          <h1 className="text-2xl font-bold text-gray-800">Users Dashboard</h1>

          <button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
          >
            + Add User
          </button>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => {
                setSelectedUser(user);
                setEditOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {editOpen && (
        <EditUserModal
          open={editOpen}
          setOpen={setEditOpen}
          user={selectedUser}
          updateUser={updateUser}
          deleteUser={deleteUser}
        />
      )}

      {open && (
        <AddUserModal
          open={open}
          setOpen={setOpen}
          addUser={addUser}
        />
      )}
    </div>
  );
}

function UserCard({ user, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex items-center gap-4 border border-gray-100">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
        {user.name.charAt(0)}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-xs text-gray-400 mt-1">{user.role}</p>
      </div>

      <button
        onClick={onEdit}
        className="px-4 py-2 text-sm rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
      >
        Edit
      </button>
    </div>
  );
}

function EditUserModal({ open, setOpen, user, updateUser, deleteUser }) {
  const [form, setForm] = useState({ name: "", email: "", role: "", status: "" });

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
    updateUser(user.id, form);
    setOpen(false);
  };

  const handleDelete = () => {
    deleteUser(user.id);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-scaleIn">

        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
        <p className="text-sm text-gray-500 mb-4">Update user details</p>

        <div className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select role</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>UI/UX Designer</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}


