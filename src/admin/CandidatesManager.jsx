import React, { useState, useEffect } from 'react';
import { Download, Eye, Trash2 } from 'lucide-react';

export const CandidatesManager = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const portalUser = JSON.parse(localStorage.getItem('portalUser') || '{}');
  const headers = { 
    'x-user-email': portalUser.email,
    'Content-Type': 'application/json'
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch('/api/candidates', { headers });
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await fetch(`/api/candidates/${id}`, { method: 'DELETE', headers });
      fetchCandidates();
    } catch (err) {
      console.error('Error deleting candidate:', err);
    }
  };

  if (loading) return <div className="text-gray-400">Loading candidates...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Manage Candidates</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role Applied</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate._id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{candidate.name}</div>
                  <div className="text-xs text-gray-500">{candidate.email}</div>
                </td>
                <td className="px-6 py-4">{candidate.role}</td>
                <td className="px-6 py-4">{candidate.experience}</td>
                <td className="px-6 py-4">{new Date(candidate.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  {candidate.resume && (
                    <a 
                      href={`/uploads/${candidate.resume}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      title="View Resume"
                    >
                      <Download size={18} />
                    </a>
                  )}
                  <button onClick={() => handleDelete(candidate._id)} className="text-red-400 hover:text-red-300 ml-2" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No candidates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
