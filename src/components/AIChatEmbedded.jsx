import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const AIChatEmbedded = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your AadhyaRaj Technologies AI Assistant. How can I help you manage the website today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatSession, setChatSession] = useState(null);

  useEffect(() => {
    if (!chatSession) {
      try {
        const systemInstruction = `You are a professional AI assistant for the administrators of AadhyaRaj Technologies. 
        Your goal is to help them manage the website content, write job descriptions, and answer technical questions.
        
        ### Context:
        - Company: AadhyaRaj Technologies
        - Services: Cloud, AI, DevOps, Business Apps, IoT, Talent Services.
        - Tone: Professional, helpful, and efficient.
        
        You can help with:
        1. Writing job descriptions.
        2. Refining 'About Us' content.
        3. Explaining tech stack components.
        4. General business inquiries.`;

        const session = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: systemInstruction,
            maxOutputTokens: 1024,
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
    <div className="flex flex-col h-full bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={"flex gap-4 " + (msg.role === 'user' ? 'flex-row-reverse' : '')}
          >
            <div className={"w-10 h-10 rounded-full flex items-center justify-center shrink-0 " + (msg.role === 'user' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600')}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={"px-5 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed " + (msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm whitespace-pre-wrap')}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 shrink-0 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="px-5 py-4 rounded-2xl bg-gray-100 text-gray-600 rounded-tl-sm flex items-center gap-1">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-white border border-gray-200 rounded-2xl pl-6 pr-14 py-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all shadow-md shadow-emerald-600/20"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};
