import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const JobsManager = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    experience: '',
    description: '',
    skills: '',
    active: true
  });

  const portalUser = JSON.parse(localStorage.getItem('portalUser') || '{}');
  const headers = { 
    'x-user-email': portalUser.email,
    'Content-Type': 'application/json'
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs', { headers });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingJob ? `/api/jobs/${editingJob._id}` : '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      });
      
      setIsModalOpen(false);
      setEditingJob(null);
      setFormData({ title: '', location: '', experience: '', description: '', skills: '', active: true });
      fetchJobs();
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE', headers });
      fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      location: job.location,
      experience: job.experience,
      description: job.description,
      skills: job.skills.join(', '),
      active: job.active
    });
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-gray-400">Loading jobs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Manage Jobs</h1>
        <button
          onClick={() => {
            setEditingJob(null);
            setFormData({ title: '', location: '', experience: '', description: '', skills: '', active: true });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Job
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{job.title}</td>
                <td className="px-6 py-4">{job.location}</td>
                <td className="px-6 py-4">
                  {job.active ? (
                    <span className="flex items-center gap-1 text-green-400"><CheckCircle size={16} /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400"><XCircle size={16} /> Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <button onClick={() => openEditModal(job)} className="text-blue-400 hover:text-blue-300">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No jobs found.</td>
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
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-white mb-6">{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Experience</label>
                  <input required type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Skills (comma separated)</label>
                <input required type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="React, Node.js, MongoDB" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500" />
                <label htmlFor="active" className="text-sm font-medium text-gray-400">Active (Visible on Careers page)</label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save Job</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
