import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch, getDocFromServer } from 'firebase/firestore';
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Search, 
  Filter, 
  User, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  X,
  AlertCircle,
  MoreVertical,
  CheckSquare,
  Square,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firebase-errors';

export const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All, Read, Unread
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'messages');
    });
    return () => unsubscribe();
  }, []);

  const handleToggleRead = async (message) => {
    try {
      await updateDoc(doc(db, 'messages', message.id), {
        read: !message.read
      });
      if (selectedMessage?.id === message.id) {
        setSelectedMessage({ ...message, read: !message.read });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `messages/${message.id}`);
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    try {
      await deleteDoc(doc(db, 'messages', messageToDelete.id));
      if (selectedMessage?.id === messageToDelete.id) setSelectedMessage(null);
      setIsDeleteModalOpen(false);
      setMessageToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `messages/${messageToDelete.id}`);
    }
  };

  const handleBulkDelete = async () => {
    const batch = writeBatch(db);
    selectedIds.forEach(id => {
      batch.delete(doc(db, 'messages', id));
    });
    try {
      await batch.commit();
      setSelectedIds([]);
      setIsDeleteModalOpen(false);
      setIsBulkDelete(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'messages/bulk-delete');
    }
  };

  const handleBulkMarkRead = async () => {
    const batch = writeBatch(db);
    selectedIds.forEach(id => {
      batch.update(doc(db, 'messages', id), { read: true });
    });
    try {
      await batch.commit();
      setSelectedIds([]);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'messages/bulk-read');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map(m => m.id));
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Read' && m.read) || 
                         (filterStatus === 'Unread' && !m.read);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-8">
      {/* Messages List */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Inbox</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                {filteredMessages.length} Messages
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-gray-300 focus:border-blue-500/50 outline-none appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Read">Read</option>
                <option value="Unread">Unread</option>
              </select>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"
            >
              <span className="text-sm font-medium text-blue-400">{selectedIds.length} selected</span>
              <div className="flex gap-2">
                <button 
                  onClick={handleBulkMarkRead}
                  className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-all"
                >
                  Mark as Read
                </button>
                <button 
                  onClick={() => {
                    setIsBulkDelete(true);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <Mail size={48} className="opacity-20" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read) handleToggleRead(message);
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 cursor-pointer transition-all hover:bg-white/5 group",
                    selectedMessage?.id === message.id ? "bg-white/5" : "",
                    !message.read ? "bg-blue-500/5" : ""
                  )}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(message.id);
                    }}
                    className="text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    {selectedIds.includes(message.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                  
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                    <User size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className={cn(
                        "text-sm truncate",
                        !message.read ? "font-bold text-white" : "text-gray-400"
                      )}>
                        {message.name}
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1 shrink-0">
                        <Clock size={10} />
                        {message.createdAt?.toDate().toLocaleDateString()}
                      </div>
                    </div>
                    <div className={cn(
                      "text-xs truncate",
                      !message.read ? "text-blue-400 font-medium" : "text-gray-500"
                    )}>
                      {message.subject}
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRead(message);
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                    >
                      {message.read ? <Mail size={16} /> : <MailOpen size={16} />}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMessageToDelete(message);
                        setIsBulkDelete(false);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Preview */}
      <div className="hidden lg:flex w-[450px] flex-col glass-card overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              <div className="p-8 border-b border-white/5 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-0.5">
                      <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center text-white">
                        <User size={24} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedMessage.name}</h3>
                      <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleToggleRead(selectedMessage)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                    >
                      {selectedMessage.read ? <Mail size={20} /> : <MailOpen size={20} />}
                    </button>
                    <button 
                      onClick={() => {
                        setMessageToDelete(selectedMessage);
                        setIsBulkDelete(false);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Subject</div>
                  <div className="text-lg font-semibold text-white">{selectedMessage.subject}</div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} />
                  <span>Received on {selectedMessage.createdAt?.toDate().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="p-8 border-t border-white/5">
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all"
                >
                  <Mail size={20} />
                  Reply via Email
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <MailOpen size={40} className="opacity-20" />
              </div>
              <h3 className="text-xl font-bold text-white">Select a message</h3>
              <p className="text-sm">Choose a message from the inbox to view its full content and reply.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

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
                {isBulkDelete 
                  ? `Are you sure you want to delete ${selectedIds.length} messages? This action cannot be undone.`
                  : `Are you sure you want to delete this message from ${messageToDelete?.name}? This action cannot be undone.`
                }
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={isBulkDelete ? handleBulkDelete : handleDelete}
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
