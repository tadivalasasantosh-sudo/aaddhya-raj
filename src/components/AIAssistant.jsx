import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'dummy-key' });

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatSession, setChatSession] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

  useEffect(() => {
    if (!chatSession) {
      // Initialize chat with a welcome message
      setMessages([
        {
          role: 'assistant',
          content: "Hello! I am the AadhyaRaj Technologies AI Assistant. I can clarify our whole process very speedily, explain what we do, and guide you through our website. How can I help you today?"
        }
      ]);
      
      // Initialize Gemini chat session
      try {
        const session = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: "You are a helpful, clear, and concise AI assistant for AadhyaRaj Technologies. Your goal is to clarify the whole website and process very speedily. Explain what we do: We are a technology company offering software development, IT consulting, and educational courses. Explain our process: We work closely with clients from requirement gathering to deployment, ensuring speedy and high-quality delivery. Guide users through the website: We have sections for Services, Careers, Courses, and Contact. Always be polite, professional, and provide clear, speedy answers."
          }
        });
        setChatSession(session);
      } catch (err) {
        console.error("Failed to initialize chat session:", err);
      }
    }
  }, [chatSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatSession) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={"fixed bottom-6 right-6 p-4 rounded-full bg-green-600 text-black shadow-lg hover:bg-green-700 hover:shadow-green-500/25 transition-all z-40 " + (isOpen ? 'scale-0' : 'scale-100')}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">AI Assistant</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={"flex gap-3 " + (msg.role === 'user' ? 'flex-row-reverse' : '')}
                >
                  <div className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 " + (msg.role === 'user' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-500/20 text-green-400')}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={"px-4 py-2 rounded-2xl max-w-[75%] text-sm " + (msg.role === 'user' ? 'bg-green-600 text-black rounded-tr-sm' : 'bg-white/10 text-gray-200 rounded-tl-sm whitespace-pre-wrap')}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white/10 text-gray-200 rounded-tl-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-green-400 hover:text-green-300 disabled:opacity-50 disabled:hover:text-green-400 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
