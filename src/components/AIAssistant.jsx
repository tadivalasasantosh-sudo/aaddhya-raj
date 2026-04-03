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
          content: "Hello! I am the Aditya Raj Technologies AI Assistant. I can summarize our [Services](#services), [About Us](#about), [Tech Stack](#tech-stack), and [Careers](#careers) for you. How can I help you today?"
        }
      ]);
      
      // Initialize Gemini chat session
      try {
        const systemInstruction = `You are a helpful, clear, and concise AI assistant for Aditya Raj Technologies. 
Your goal is to clarify the whole website and process very speedily. 

### Website Content Summary:
- **About Us** (#about): Aditya Raj Technologies is a modern technology company focused on building scalable, secure, and high-performance digital solutions. We specialize in full-stack development, enterprise application development, and AI-driven systems. We have 10+ years of experience and 200+ global clients.
- **Services** (#services): 
  - Cloud Services (AWS, Azure, GCP migration & management)
  - Modern Workplace (Digital tools & remote work environments)
  - Cloud Analytics & AI (Data insights & predictive trends)
  - Business Applications (Enterprise-grade app development)
  - Mobility Solutions (Mobile-friendly business connectivity)
  - DevOps Services (CI/CD pipelines & automation)
  - Internet of Things (IoT) (Scalable IoT solutions)
  - Talent Services (Staffing & resource-as-a-service)
- **Tech Stack** (#tech-stack): 
  - Frontend: React.js, Next.js, Vue.js, Angular, Tailwind CSS, TypeScript
  - Backend: Node.js, Java, Spring Boot, Python, Express.js, GraphQL
  - Database: MongoDB, PostgreSQL, MySQL, Redis, Firebase, ElasticSearch
  - Cloud & DevOps: AWS, Azure, Google Cloud, Docker, Kubernetes, CI/CD
  - AI & Machine Learning: TensorFlow, PyTorch, OpenAI, LangChain, Computer Vision, NLP
  - Mobile: React Native, Flutter, iOS (Swift), Android (Kotlin)
- **Careers** (#careers): We are looking for experts in Java Full Stack, Generative AI, IBM Sterling, OpenText Archive, and React.js. We offer hybrid work, growth paths, and health benefits.
- **Contact** (#contact): Reach out for inquiries or collaborations.

### Instructions:
1. **Summarize**: When asked about specific sections, provide a concise summary based on the content above.
2. **Direct Links**: Always provide direct links to relevant sections using markdown syntax: [Section Name](#section-id). For example: [Services](#services), [About Us](#about), [Tech Stack](#tech-stack), [Careers](#careers), [Contact](#contact).
3. **Speed**: Be very speedy and clear in your responses.
4. **Tone**: Be polite, professional, and helpful.`;

        const session = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: systemInstruction
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
        className={"fixed bottom-6 right-6 p-4 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 hover:shadow-emerald-600/25 transition-all z-40 " + (isOpen ? 'scale-0' : 'scale-100')}
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
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">AI Assistant</h3>
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
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
                  <div className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 " + (msg.role === 'user' ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-50 text-emerald-600')}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={"px-4 py-2 rounded-2xl max-w-[75%] text-sm " + (msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-700 rounded-tl-sm whitespace-pre-wrap')}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 rounded-tl-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:hover:text-emerald-600 transition-colors"
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
