import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Shield, User } from 'lucide-react';
import { motion } from 'motion/react';

export const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'hr',
    active: true
  });

  const portalUser = JSON.parse(localStorage.getItem('portalUser') || '{}');
  const headers = { 
    'x-user-email': portalUser.email,
    'Content-Type': 'application/json'
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { headers });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser ? `/api/users/${editingUser._id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      });
      
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'hr', active: true });
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE', headers });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    });
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-gray-400">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Manage HR Users</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: '', email: '', role: 'hr', active: true });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.role === 'admin' ? (
                    <span className="flex items-center gap-1 text-purple-400"><Shield size={16} /> Admin</span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-400"><User size={16} /> HR</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.active ? (
                    <span className="flex items-center gap-1 text-green-400"><CheckCircle size={16} /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400"><XCircle size={16} /> Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <button onClick={() => openEditModal(user)} className="text-blue-400 hover:text-blue-300">
                    <Edit2 size={18} />
                  </button>
                  {user.email !== portalUser.email && (
                    <button onClick={() => handleDelete(user._id)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-6">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={!!editingUser} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none">
                  <option value="hr">HR Portal</option>
                  <option value="admin">Super Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500" />
                <label htmlFor="active" className="text-sm font-medium text-gray-400">Active Account</label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save User</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
