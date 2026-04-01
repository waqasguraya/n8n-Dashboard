"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase.js";
import AddUserModal from "./components/popup.jsx";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("Users").select("*");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateUser = (id, updatedData) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
    );
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Users Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage your team members
            </p>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition"
            >
              + Add User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Total</p>
            <h3 className="text-xl font-semibold">{filteredUsers.length}</h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Active</p>
            <h3 className="text-xl font-semibold">
              {filteredUsers.filter((u) => u.status === "active").length}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Inactive</p>
            <h3 className="text-xl font-semibold">
              {filteredUsers.filter((u) => u.status === "inactive").length}
            </h3>
          </div>
        </div>

        {/* Users List */}
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
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

      {/* Edit Modal */}
      {editOpen && (
        <EditUserModal
          open={editOpen}
          setOpen={setEditOpen}
          user={selectedUser}
          updateUser={updateUser}
          deleteUser={deleteUser}
        />
      )}

      {/* Add Modal */}
      {open && (
        <AddUserModal
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  );
}

//////////////////////////////////////////////////////
// ✅ USER CARD
//////////////////////////////////////////////////////

function UserCard({ user, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex items-center gap-4 border border-gray-100">

      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
          {user.name?.charAt(0) || "U"}
        </div>

        {/* Status Dot */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            user.status === "active" ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {user.name}
        </h3>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-xs text-gray-400 mt-1">{user.role}</p>
      </div>

      {/* Edit Button */}
      <button
        onClick={onEdit}
        className="px-4 py-2 text-sm rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
      >
        Edit
      </button>
    </div>
  );
}

//////////////////////////////////////////////////////
// ✅ EDIT MODAL (MATCHED DESIGN)
//////////////////////////////////////////////////////

function EditUserModal({ open, setOpen, user, updateUser, deleteUser }) {
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

  const handleSave = async () => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from("Users")
        .update(form)
        .eq("id", user.id);

      if (error) {
        console.error("Error updating user in database:", error);
        alert("Failed to update user in database");
        return;
      }

      // Update in Jira if accountId exists
      if (user.accountId) {
        const jiraResponse = await fetch("/api/jira", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountId: user.accountId,
            username: form.name,
            email: form.email,
            name: form.name,
          }),
        });

        if (!jiraResponse.ok) {
          const jiraError = await jiraResponse.json();
          console.error("Error updating user in Jira:", jiraError);
          // Don't return here, as database update succeeded
        }
      }

      // Update local state
      updateUser(user.id, form);
      setOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleDelete = async () => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from("Users")
        .delete()
        .eq("id", user.id);

      if (error) {
        console.error("Error deleting user from database:", error);
        alert("Failed to delete user from database");
        return;
      }

      // Note: Jira user deletion would require admin permissions and is not implemented here
      // as it's typically not done through the API for security reasons

      // Update local state
      deleteUser(user.id);
      setOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">

        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          Edit User
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Update user details
        </p>

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

          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}