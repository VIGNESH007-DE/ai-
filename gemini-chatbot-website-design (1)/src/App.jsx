import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Moon, 
  Sun, 
  Sparkles, 
  Plus, 
  Menu, 
  X, 
  Globe, 
  ExternalLink,
  MessageSquare,
  Settings,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiResponse } from './lib/gemini';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SUGGESTED_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a polite email to decline a job offer",
  "Give me some creative ideas for a 10-year-old's birthday party",
  "How do I make a perfect chocolate cake?"
];

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hi! I'm Gemini Flash. I'm ready to help you with anything from coding to creative writing. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!import.meta.env.VITE_GEMINI_API_KEY);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSubmit = async (e, customInput) => {
    if (e) e.preventDefault();
    const messageText = customInput || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(messageText, messages);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "### ⚠️ Connection Error\n\nI couldn't reach the AI. Please make sure your API key is correctly set in the `.env` file." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Clear current conversation?')) {
      setMessages([{ role: 'model', content: "Conversation cleared. How can I help you now?" }]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative z-30 w-[var(--sidebar-width)] h-full glass-panel transition-transform duration-300 ease-in-out md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Bot size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">Gemini AI</span>
          </div>

          <button 
            onClick={() => {
              setMessages([{ role: 'model', content: "New conversation started. How can I assist you?" }]);
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-3 w-full p-4 mb-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold text-sm">New Chat</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-1 mb-4">
            <div className="px-2 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent</span>
            </div>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
              <MessageSquare size={18} />
              <span className="truncate">Current Conversation</span>
            </button>
            {/* History placeholders */}
            {[1, 2, 3].map(i => (
              <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 transition-colors text-sm">
                <MessageSquare size={18} />
                <span className="truncate">Previous Chat {i}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-1 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 transition-colors text-sm">
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 transition-colors text-sm">
              <HelpCircle size={18} />
              <span>Help & Support</span>
            </button>
            
            <div className="p-3 mt-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                <span className="text-xs font-semibold">Pro Plan</span>
              </div>
              <ExternalLink size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0b101b]">
        {/* Navbar */}
        <nav className="h-16 flex items-center justify-between px-4 md:px-8 glass sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-bold flex items-center gap-2">
                Gemini 1.5 Flash 
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase font-black">Fast</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                <span className="text-[10px] text-slate-400 font-medium">Ready to chat</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={clearChat}
              className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-500 hover:text-red-500 transition-all"
              title="Clear Conversation"
            >
              <Trash2 size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all"
            >
              <Globe size={20} />
            </a>
          </div>
        </nav>

        {/* Chat Area */}
        <main 
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {!hasApiKey && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-4"
              >
                <div className="bg-amber-500 p-2 rounded-xl text-white shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">API Key Missing</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    To use the chatbot, please add your <b>VITE_GEMINI_API_KEY</b> to the <code>.env</code> file in the project root.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="space-y-8 pb-12">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={cn(
                    "flex gap-4 md:gap-6",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === 'user' 
                      ? "bg-indigo-600 text-white" 
                      : "bg-white dark:bg-slate-800 text-indigo-500 border border-slate-200 dark:border-slate-700"
                  )}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={24} />}
                  </div>
                  
                  <div className={cn(
                    "flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-4 md:px-5 py-3.5 rounded-3xl shadow-sm",
                      msg.role === 'user' 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none"
                    )}>
                      <div className="prose dark:prose-invert">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium px-2">
                      {msg.role === 'user' ? 'You' : 'Gemini Flash'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-500 animate-pulse">
                    <Sparkles size={20} />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-5 rounded-3xl rounded-tl-none flex gap-1.5 items-center shadow-sm">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}

              {messages.length === 1 && !isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-12 max-w-2xl mx-auto">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubmit(null, prompt)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all text-left group"
                    >
                      <p className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Input Footer */}
        <footer className="p-4 md:p-8 glass">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSubmit} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Gemini Flash..."
                className="w-full input-field pr-24 py-5 shadow-xl shadow-indigo-500/5"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button
                  type="button"
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-all hidden sm:block"
                  title="Upload Image (UI placeholder)"
                >
                  <Plus size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "p-3 rounded-xl transition-all shadow-md",
                    input.trim() && !isLoading 
                      ? "bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-500/40" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-4 font-medium flex items-center justify-center gap-2">
              Gemini can make mistakes. Check important info.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
