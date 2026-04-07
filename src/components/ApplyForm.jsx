import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";

export default function ApplyForm({ preSelectedRole = "" }) {
  const [form, setForm] = useState({ role: preSelectedRole });
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'jobs');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (preSelectedRole) {
      setForm((prev) => ({ ...prev, role: preSelectedRole }));
    }
  }, [preSelectedRole]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    // Simulate submission
    console.log("Submitting application:", { ...form, resume: file ? file.name : null });
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Application submitted! (Demo Mode)");
      setForm({ role: preSelectedRole });
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto bg-white/5 p-8 rounded-xl border border-white/10">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white mb-2">Apply Now</h2>
        <p className="text-gray-400 text-sm">Please fill out the application form below and attach your resume.</p>
      </div>

      <input className="p-3 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:border-sky-500" name="name" value={form.name || ''} placeholder="Full Name" onChange={handleChange} />
      <input className="p-3 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:border-sky-500" name="email" value={form.email || ''} placeholder="Email" onChange={handleChange} />
      <input className="p-3 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:border-sky-500" name="phone" value={form.phone || ''} placeholder="Phone" onChange={handleChange} />
      <input className="p-3 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:border-sky-500" name="linkedin" value={form.linkedin || ''} placeholder="LinkedIn" onChange={handleChange} />

      <select className="p-3 rounded-lg bg-gray-900 text-white border border-white/10 focus:outline-none focus:border-sky-500" name="role" value={form.role || ''} onChange={handleChange}>
        <option value="">Select Role</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.title}>{job.title}</option>
        ))}
        <option value="Other">Other / General Application</option>
      </select>

      <textarea 
        className="p-3 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:border-sky-500 resize-none" 
        name="additionalInfo" 
        value={form.additionalInfo || ''} 
        placeholder="Additional Information / Cover Letter" 
        onChange={handleChange} 
        rows={4} 
      />

      <input
        className="text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="mt-4 bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold py-3 px-4 rounded-lg transition-colors" onClick={submit}>
        Apply
      </button>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <a 
        href={`mailto:tag@aadhyarajtech.com?subject=Job Application: ${form.role || 'General'}&body=Name: ${form.name || ''}%0D%0AEmail: ${form.email || ''}%0D%0APhone: ${form.phone || ''}%0D%0ALinkedIn: ${form.linkedin || ''}%0D%0A%0D%0APlease attach your resume to this email.`}
        className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center border border-white/10"
      >
        Send Details Directly to Email
      </a>
    </div>
  );
}
