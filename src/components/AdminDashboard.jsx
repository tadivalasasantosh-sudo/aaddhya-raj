import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, Briefcase, MessageSquare, Settings, LogOut, Check, Mail, Trash2, Edit2, Image as ImageIcon, Menu as MenuIcon, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, setDoc, getDoc } from 'firebase/firestore';
import { Plus, X as CloseIcon } from 'lucide-react';
import { OperationType, handleFirestoreError } from '../firebase';
import { ConfirmModal } from './ConfirmModal';
import { generateAIContent } from '../context/gemini';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState(null);
  const [messages, setMessages] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    aboutText: '',
    contactEmail: 'Info@aadhyarajtech.com',
    whatsappNumber: '+91 9127912345',
    careerDetails: 'We are looking for passionate individuals to join our team and build the future of AadhyaRaj Technologies together.',
    aboutImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80'
  });
  const [about, setAbout] = useState({
    title: 'About AadhyaRaj Technologies',
    description: 'AadhyaRaj Technologies is a modern technology company focused on building scalable, secure, and high-performance digital solutions.',
    mission: '',
    vision: '',
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });
  const [jobFormData, setJobFormData] = useState({
    title: '',
    location: '',
    experience: '',
    description: '',
    skills: ''
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    let unsubscribeMessages;
    let unsubscribeJobs;
    let unsubscribeUsers;
    let unsubscribeSettings;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user role
        let role = 'user';
        if (user.email === 'tadivalasasantosh@gmail.com') {
          role = 'admin';
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              role = userDoc.data().role;
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          }
        }
        setUserRole(role);

        if (!['admin', 'hr'].includes(role)) {
          navigate('/');
          return;
        }

        // HR only sees jobs
        if (role === 'hr') {
          setActiveTab('jobs');
        }

        // Fetch jobs (both roles need this)
        const qJobs = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
        unsubscribeJobs = onSnapshot(qJobs, (snapshot) => {
          setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => handleFirestoreError(error, OperationType.LIST, 'jobs'));

        // Admin only data
        if (role === 'admin') {
          const qMessages = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
          unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, (error) => handleFirestoreError(error, OperationType.LIST, 'messages'));

          const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
          unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

          unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
            if (snapshot.exists()) {
              setSettings(snapshot.data());
            }
          }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));

          const unsubscribeAbout = onSnapshot(doc(db, 'about', 'content'), (snapshot) => {
            if (snapshot.exists()) {
              setAbout(snapshot.data());
            }
          }, (error) => handleFirestoreError(error, OperationType.GET, 'about/content'));
        }
        
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeJobs) unsubscribeJobs();
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, [navigate]);

  // Remove the activeTab based useEffect since we fetch everything now

  const handleGenerateJobDescription = async () => {
    if (!jobFormData.title) {
      alert("Please enter a job title first.");
      return;
    }
    setIsGeneratingAI(true);
    try {
      const prompt = `Write a professional job description for the role of "${jobFormData.title}" at AadhyaRaj Technologies. 
      Include key responsibilities, requirements, and why someone should join our team. 
      Keep it concise and engaging.`;
      const content = await generateAIContent(prompt);
      setJobFormData(prev => ({ ...prev, description: content }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown AI error";
      if (errorMessage.includes('tokens')) {
        alert("The generated content was too long. Please try a more specific title.");
      } else if (errorMessage.includes('API key')) {
        alert("Gemini API key is not configured correctly. Please check your environment variables.");
      } else {
        alert(`AI Error: ${errorMessage}`);
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleGenerateAboutText = async (field) => {
    setIsGeneratingAI(true);
    try {
      let prompt = "";
      if (field === 'aboutText') {
        prompt = "Write a compelling 'About Us' section for AadhyaRaj Technologies. Focus on our 10+ years of experience, 200+ global clients, and our expertise in Cloud, AI, and Enterprise solutions.";
      } else if (field === 'careerDetails') {
        prompt = "Write an inspiring 'Careers' introduction for AadhyaRaj Technologies. Highlight our culture of innovation, growth opportunities, and why talented people should join us.";
      } else if (field === 'mission') {
        prompt = "Write a concise and powerful mission statement for AadhyaRaj Technologies.";
      } else if (field === 'vision') {
        prompt = "Write a visionary and forward-looking vision statement for AadhyaRaj Technologies.";
      }

      const content = await generateAIContent(prompt);
      
      if (field === 'aboutText' || field === 'careerDetails') {
        setSettings(prev => ({ ...prev, [field]: content }));
      } else {
        setAbout(prev => ({ ...prev, [field]: content }));
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown AI error";
      if (errorMessage.includes('tokens')) {
        alert("The generated content was too long. Please try again.");
      } else {
        alert(`AI Error: ${errorMessage}`);
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const updateMessageStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'messages', id), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `messages/${id}`);
    }
  };

  const deleteMessage = async (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Message',
      message: 'Are you sure you want to delete this message? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'messages', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
        }
      }
    });
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = jobFormData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
      await addDoc(collection(db, 'jobs'), {
        ...jobFormData,
        skills: skillsArray,
        createdAt: new Date().toISOString()
      });
      setShowJobModal(false);
      setJobFormData({ title: '', location: '', experience: '', description: '', skills: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'jobs');
    }
  };

    const deleteJob = async (id) => {
      setConfirmConfig({
        isOpen: true,
        title: 'Delete Job Opening',
        message: 'Are you sure you want to delete this job opening? This will remove it from the careers page.',
        type: 'danger',
        onConfirm: async () => {
          try {
            await deleteDoc(doc(db, 'jobs', id));
          } catch (error) {
            console.error("Delete Job Error:", error);
            alert("Failed to delete job. Please check permissions.");
          }
        }
      });
    };

    const updateUserRole = async (userId, newRole) => {
      try {
        await updateDoc(doc(db, 'users', userId), { role: newRole });
      } catch (error) {
        console.error("Update User Role Error:", error);
        alert("Failed to update user role.");
      }
    };

    const handleUpdateSettings = async (e) => {
      e.preventDefault();
      try {
        await setDoc(doc(db, 'settings', 'global'), settings);
        alert("Settings updated successfully!");
      } catch (error) {
        console.error("Update Settings Error:", error);
        alert("Failed to update settings.");
      }
    };

  const seedInitialJobs = async () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Seed Sample Jobs',
      message: 'This will add 5 sample job openings to your database. Continue?',
      type: 'info',
      onConfirm: async () => {
        try {
          const initialJobs = [
          {
            title: 'Senior Java Full Stack Developer (React)',
            experience: '8–10 years',
            location: 'Pune (Hybrid)',
            description: 'Build and maintain enterprise-level applications using modern Java and React stacks.',
            responsibilities: [
              'Build and maintain enterprise-level applications',
              'Create backend using Java + Spring Boot',
              'Develop frontend using React.js',
              'Work in an Agile team environment',
              'Fix bugs and support live systems',
              'Modernize legacy systems'
            ],
            skills: {
              'Backend': ['Java (8/11/17)', 'Spring Boot', 'Spring MVC', 'Spring Security', 'REST APIs', 'Microservices', 'Hibernate / JPA', 'OAuth2', 'JWT'],
              'Frontend': ['React.js', 'JavaScript / TypeScript', 'Redux / Context API', 'HTML5', 'CSS3'],
              'Database': ['Oracle', 'SQL Server', 'SQL Queries'],
              'Tools': ['Git', 'Jenkins', 'Docker', 'AWS / Azure', 'JUnit', 'Mockito', 'Jest']
            }
          },
          {
            title: 'Generative AI Engineer',
            experience: '7+ years',
            location: 'Gurgaon (Hybrid)',
            description: 'Build cutting-edge AI applications using LLMs, RAG, and Agentic AI systems.',
            responsibilities: [
              'Build AI applications using LLMs',
              'Work on RAG, NLP, and ML models',
              'Create Agentic AI systems',
              'Use Python for AI development',
              'Deploy projects using CI/CD',
              'Work with OCR and image processing'
            ],
            skills: {
              'Core AI': ['Generative AI', 'LLMs', 'Python (Expert)', 'Machine Learning', 'Agentic AI', 'MCP'],
              'Specialties': ['OCR', 'Image Processing'],
              'DevOps': ['Docker', 'Kubernetes', 'Jenkins']
            }
          },
          {
            title: 'IBM Sterling B2B Integrator Developer',
            experience: '5+ years',
            location: 'Hyderabad (Hybrid)',
            description: 'Manage complex B2B integrations and business processes for global clients.',
            responsibilities: [
              'Build and manage B2B integrations',
              'Create business processes',
              'Handle file transfers between companies',
              'Monitor systems and fix issues',
              'Support production systems'
            ],
            skills: {
              'Core Sterling': ['IBM Sterling B2Bi', 'Business Process Development', 'Map Development', 'Sterling File Gateway'],
              'Operations': ['File Monitoring', 'Troubleshooting', 'Production Support']
            }
          },
          {
            title: 'OpenText Archive Migration Specialist (SAP)',
            experience: '5+ years',
            location: 'Hyderabad (Hybrid)',
            description: 'Lead data migration projects from legacy systems to cloud-based SAP environments.',
            responsibilities: [
              'Move data from legacy systems to cloud',
              'Work with SAP + OpenText integrations',
              'Test and validate migrated data',
              'Ensure data integrity and security',
              'Coordinate with cross-functional teams'
            ],
            skills: {
              'Core': ['OpenText Archive (Cloud & On-Prem)', 'SAP Integration', 'Data Migration'],
              'Process': ['Testing & Validation', 'Team Coordination', 'Project Management']
            }
          },
          {
            title: 'Senior React.js Developer / Frontend Lead',
            experience: '5+ years',
            location: 'Pune (Hybrid)',
            description: 'Lead frontend architecture and guide teams in building scalable, high-performance UIs.',
            responsibilities: [
              'Lead frontend development initiatives',
              'Design scalable UI architecture',
              'Mentor and guide team members',
              'Collaborate with product and design teams',
              'Optimize UI performance and quality'
            ],
            skills: {
              'Core Frontend': ['React.js (Expert)', 'JavaScript / TypeScript', 'HTML5', 'CSS3'],
              'Backend Integration': ['API Integration'],
              'Optimization': ['UI Performance Optimization', 'Code Quality Practices'],
              'Architecture': ['Architecture Design']
            }
          }
        ];

        for (const job of initialJobs) {
          await addDoc(collection(db, 'jobs'), {
            ...job,
            createdAt: new Date().toISOString()
          });
        }
        alert("Initial jobs seeded successfully!");
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'jobs');
      }
    }
    });
  };

  const handleUpdateAbout = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'about', 'content'), about);
      alert("About content updated successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'about/content');
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'text-sky-400' },
    { label: 'Job Openings', value: jobs.length.toString(), icon: Briefcase, color: 'text-sky-400' },
    { label: 'Contact Inquiries', value: messages.length.toString(), icon: MessageSquare, color: 'text-sky-400' },
  ];

  const renderDashboard = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium text-sky-400 bg-sky-400/10 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">Recent Contact Inquiries</h2>
        <div className="space-y-4">
          {messages.slice(0, 3).map((msg) => (
            <div key={msg.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center font-bold">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{msg.name}</div>
                  <div className="text-xs text-gray-400">{msg.subject}</div>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('messages')}
                className="text-sm text-sky-400 hover:underline"
              >
                View Details
              </button>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-6 text-gray-500 italic">
              No recent inquiries.
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <div className="text-sm text-gray-400">{messages.length} total messages</div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">No messages found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl border transition-all ${
                msg.status === 'new' 
                  ? 'bg-sky-500/5 border-sky-500/20' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{msg.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${
                      msg.status === 'new' ? 'bg-sky-500 text-white' :
                      msg.status === 'read' ? 'bg-gray-600 text-gray-200' :
                      'bg-sky-600 text-white'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail size={14} />
                    {msg.email}
                  </div>
                  <div className="text-sm font-medium text-sky-400">Subject: {msg.subject}</div>
                  <p className="text-gray-300 mt-4 whitespace-pre-wrap">{msg.message}</p>
                  <div className="text-xs text-gray-500 mt-4">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-end">
                  {msg.status !== 'read' && msg.status !== 'replied' && (
                    <button
                      onClick={() => updateMessageStatus(msg.id, 'read')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm"
                      title="Mark as Read"
                    >
                      <Check size={16} />
                      <span className="md:hidden">Mark Read</span>
                    </button>
                  )}
                  {msg.status !== 'replied' && (
                    <button
                      onClick={() => updateMessageStatus(msg.id, 'replied')}
                      className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-all flex items-center gap-2 text-sm"
                      title="Mark as Replied"
                    >
                      <Mail size={16} />
                      <span className="md:hidden">Mark Replied</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all flex items-center gap-2 text-sm"
                    title="Delete Message"
                  >
                    <Trash2 size={16} />
                    <span className="md:hidden">Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Careers Portal</h2>
        <button 
          onClick={() => setShowJobModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium transition-all"
        >
          <Plus size={20} />
          Add New Job
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h3 className="text-lg font-semibold mb-4">Career Optimization & Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Career Introduction / Details</label>
              <button
                onClick={() => handleGenerateAboutText('careerDetails')}
                disabled={isGeneratingAI}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors disabled:opacity-50"
                title="Generate with Gemini AI"
              >
                {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Generate with AI
              </button>
            </div>
            <textarea 
              rows={4}
              value={settings.careerDetails}
              onChange={(e) => setSettings({...settings, careerDetails: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none resize-none"
              placeholder="Enter career details and culture information..."
            />
          </div>
          <button 
            onClick={handleUpdateSettings}
            className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all"
          >
            Update Career Details
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Active Job Openings</h3>
        {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
          <Briefcase size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">No job openings found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-400 mb-4">
                    <span>{job.location}</span>
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-white/10 text-xs text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{job.description}</p>
                </div>
                <button 
                  onClick={() => deleteJob(job.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </div>

      {/* Add Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add New Job Opening</h3>
              <button onClick={() => setShowJobModal(false)} className="text-gray-400 hover:text-white">
                <CloseIcon size={24} />
              </button>
            </div>

            <form onSubmit={handleAddJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Job Title</label>
                  <input 
                    required
                    type="text"
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                    placeholder="Frontend Developer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Location</label>
                  <input 
                    required
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                    placeholder="Hyderabad / Remote"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Experience</label>
                <input 
                  required
                  type="text"
                  value={jobFormData.experience}
                  onChange={(e) => setJobFormData({...jobFormData, experience: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                  placeholder="2-4 Years"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Skills (comma separated)</label>
                <input 
                  required
                  type="text"
                  value={jobFormData.skills}
                  onChange={(e) => setJobFormData({...jobFormData, skills: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                  placeholder="React, Tailwind, Firebase"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-400">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateJobDescription}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors disabled:opacity-50"
                    title="Generate with Gemini AI"
                  >
                    {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Generate with AI
                  </button>
                </div>
                <textarea 
                  required
                  rows={4}
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none resize-none"
                  placeholder="Job responsibilities and requirements..."
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all mt-4"
              >
                Create Job Opening
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="text-sm text-gray-400">{users.length} total users</div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
          <Users size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">No users found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white">{user.email}</div>
                  <div className="text-xs text-gray-400">ID: {user.uid}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={user.role || 'user'}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="bg-white/5 border border-white/10 text-xs rounded-lg px-2 py-1 outline-none focus:border-sky-500"
                >
                  <option value="user" className="bg-gray-900">User</option>
                  <option value="hr" className="bg-gray-900">HR Portal</option>
                  <option value="admin" className="bg-gray-900">Admin</option>
                </select>
                <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${
                  user.role === 'admin' ? 'bg-purple-500 text-white' : 
                  user.role === 'hr' ? 'bg-sky-500 text-white' :
                  'bg-sky-500/20 text-sky-400'
                }`}>
                  {user.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Global Settings</h2>
      
      <form onSubmit={handleUpdateSettings} className="max-w-2xl space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">About Us Text</label>
            <button
              type="button"
              onClick={() => handleGenerateAboutText('aboutText')}
              disabled={isGeneratingAI}
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors disabled:opacity-50"
              title="Generate with Gemini AI"
            >
              {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Generate with AI
            </button>
          </div>
          <textarea 
            rows={6}
            value={settings.aboutText}
            onChange={(e) => setSettings({...settings, aboutText: e.target.value})}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none resize-none"
            placeholder="Enter the main text for the About section..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Contact Email</label>
            <input 
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">WhatsApp Number</label>
            <input 
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <button 
            type="submit"
            className="px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all"
          >
            Save Changes
          </button>
          <button 
            type="button"
            onClick={seedInitialJobs}
            className="px-8 py-3 rounded-xl bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 border border-sky-500/20 font-bold transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Seed Sample Jobs
          </button>
        </div>
      </form>
    </div>
  );

  const renderGeminiChat = () => (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Sparkles className="text-sky-400" size={20} />
        <h2 className="text-xl font-bold">AadhyaRaj AI Assistant</h2>
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <iframe 
          src="/ai-chat-embedded" 
          className="w-full h-full border-none rounded-xl bg-white"
          title="Gemini AI Chat"
        />
      </div>
    </div>
  );

  const renderAboutEditor = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">About Page Editor</h2>
        <button 
          onClick={handleUpdateAbout}
          className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all flex items-center gap-2"
        >
          <Check size={18} />
          Save All Changes
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Edit2 size={18} className="text-sky-400" />
          Content Details
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Page Title</label>
            <input 
              type="text"
              value={about.title}
              onChange={(e) => setAbout({...about, title: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Main Description</label>
              <button
                type="button"
                onClick={() => handleGenerateAboutText('description')}
                disabled={isGeneratingAI}
                className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 transition-colors disabled:opacity-50"
                title="Generate with Gemini AI"
              >
                {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Generate with AI
              </button>
            </div>
            <textarea 
              rows={4}
              value={about.description}
              onChange={(e) => setAbout({...about, description: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Mission Statement</label>
              <button
                type="button"
                onClick={() => handleGenerateAboutText('mission')}
                disabled={isGeneratingAI}
                className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 transition-colors disabled:opacity-50"
                title="Generate with Gemini AI"
              >
                {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Generate with AI
              </button>
            </div>
            <textarea 
              rows={3}
              value={about.mission}
              onChange={(e) => setAbout({...about, mission: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Vision Statement</label>
              <button
                type="button"
                onClick={() => handleGenerateAboutText('vision')}
                disabled={isGeneratingAI}
                className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 transition-colors disabled:opacity-50"
                title="Generate with Gemini AI"
              >
                {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Generate with AI
              </button>
            </div>
            <textarea 
              rows={3}
              value={about.vision}
              onChange={(e) => setAbout({...about, vision: e.target.value})}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center font-bold text-white">
            {userRole === 'hr' ? 'HR' : 'AR'}
          </div>
          <span className="font-bold text-lg text-gray-900">{userRole === 'hr' ? 'HR Portal' : 'Admin Panel'}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-500 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </header>

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-8 transition-transform duration-300 md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center font-bold text-white">
              {userRole === 'hr' ? 'HR' : 'AR'}
            </div>
            <span className="font-bold text-xl text-gray-900">{userRole === 'hr' ? 'HR Portal' : 'Admin Panel'}</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-900"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {userRole === 'admin' && (
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === 'dashboard' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
          )}
          {userRole === 'admin' && (
            <button 
              onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === 'users' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Users size={20} />
              Users
            </button>
          )}
          <button 
            onClick={() => { setActiveTab('jobs'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              activeTab === 'jobs' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Briefcase size={20} />
            Careers Portal
          </button>
          {userRole === 'admin' && (
            <button 
              onClick={() => { setActiveTab('messages'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === 'messages' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <MessageSquare size={20} />
              Messages
            </button>
          )}
          {userRole === 'admin' && (
            <button 
              onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === 'settings' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings size={20} />
              Settings
            </button>
          )}
          {userRole === 'admin' && (
            <button 
              onClick={() => { setActiveTab('ai'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === 'ai' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Sparkles size={20} />
              AI Assistant
            </button>
          )}
          {userRole === 'admin' && (
            <button 
              onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === 'about' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ImageIcon size={20} />
              About Page
            </button>
          )}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-auto font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              {activeTab === 'dashboard' ? 'Welcome back, Admin' : 
               activeTab === 'jobs' ? 'Careers Portal' :
               activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-gray-500">
              {activeTab === 'dashboard' ? "Here's what's happening with your business today." : 
               activeTab === 'jobs' ? 'Manage your job openings and career details here.' :
               `Manage your ${activeTab} here.`}
            </p>
          </div>
          <Link to="/" className="px-6 py-2 rounded-full border border-gray-200 hover:bg-white hover:shadow-sm transition-all text-sm font-semibold text-gray-700">
            View Website
          </Link>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'jobs' && renderJobs()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'about' && renderAboutEditor()}
        {activeTab === 'ai' && renderGeminiChat()}
        {activeTab !== 'dashboard' && activeTab !== 'messages' && activeTab !== 'jobs' && activeTab !== 'users' && activeTab !== 'settings' && activeTab !== 'about' && activeTab !== 'ai' && (
          <div className="text-center py-24 text-gray-400 italic">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management coming soon...
          </div>
        )}
      </main>

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
    </div>
  );
};
