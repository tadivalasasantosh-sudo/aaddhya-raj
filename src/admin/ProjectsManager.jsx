import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  ExternalLink, 
  Github, 
  Search, 
  Filter, 
  ArrowUpDown,
  Check,
  AlertTriangle,
  Upload,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firebase-errors';

const CATEGORIES = ['Web Development', 'Mobile Apps', 'Cloud Solutions', 'AI & ML', 'Cyber Security', 'UI/UX Design'];

export const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title-asc, title-desc

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    imageUrl: '',
    link: '',
    github: '',
  });

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setIsUploading(true);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setIsUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setIsUploading(false);
          setUploadProgress(0);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;
      
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const projectData = {
        ...formData,
        imageUrl: finalImageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
    } catch (error) {
      handleFirestoreError(error, editingProject ? OperationType.UPDATE : OperationType.CREATE, editingProject ? `projects/${editingProject.id}` : 'projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      // If project has a storage image, try to delete it
      if (projectToDelete.imageUrl && projectToDelete.imageUrl.includes('firebasestorage')) {
        try {
          const imageRef = ref(storage, projectToDelete.imageUrl);
          await deleteObject(imageRef);
        } catch (e) {
          console.warn('Could not delete image from storage:', e);
        }
      }
      
      await deleteDoc(doc(db, 'projects', projectToDelete.id));
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${projectToDelete.id}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: CATEGORIES[0],
      imageUrl: '',
      link: '',
      github: '',
    });
    setImageFile(null);
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      imageUrl: project.imageUrl,
      link: project.link || '',
      github: project.github || '',
    });
    setIsModalOpen(true);
  };

  const filteredAndSortedProjects = projects
    .filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return b.createdAt?.toMillis() - a.createdAt?.toMillis();
        case 'oldest': return a.createdAt?.toMillis() - b.createdAt?.toMillis();
        case 'title-asc': return a.title.localeCompare(b.title);
        case 'title-desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects Manager</h1>
          <p className="text-gray-500">Manage your portfolio and showcase your best work.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all"
        >
          <Plus size={20} />
          Add New Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none appearance-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card group overflow-hidden flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={project.imageUrl || `https://picsum.photos/seed/${project.id}/800/600`} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  {project.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 flex-1">{project.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex gap-3">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
                        <ExternalLink size={18} />
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
                        <Github size={18} />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(project)}
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        setProjectToDelete(project);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button onClick={resetForm} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Project Title</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      placeholder="E-commerce Platform"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none appearance-none"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                    placeholder="Describe the project goals, technologies used, and your role..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Project Image</label>
                  <div className="flex flex-col gap-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4",
                        imageFile || formData.imageUrl 
                          ? "border-blue-500/50 bg-blue-500/5" 
                          : "border-white/10 hover:border-white/20 bg-white/5"
                      )}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className="hidden" 
                        accept="image/*" 
                      />
                      
                      {imageFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <Check className="text-green-400" size={32} />
                          <span className="text-sm text-gray-300">{imageFile.name}</span>
                        </div>
                      ) : formData.imageUrl ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                          <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="text-white" size={32} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                            <Upload size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-white">Click to upload image</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (max. 5MB)</p>
                          </div>
                        </>
                      )}
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Uploading...</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }} 
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-white/5" />
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">OR</span>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none pl-10"
                        placeholder="Paste image URL instead..."
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Live Demo URL</label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none pl-10"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">GitHub Repository</label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none pl-10"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || isUploading}
                    className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md glass-card p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Confirm Deletion</h2>
              <p className="text-gray-400 mb-8">
                Are you sure you want to delete <span className="text-white font-semibold">"{projectToDelete?.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
