import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Moon, Sun, Menu, X } from "lucide-react";
import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import { sendMessage } from "./lib/gemini";
import { Sparkles, BrainCircuit, Code, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./utils/cn";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = { role: "user", parts: [{ text }] };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(messages, text);
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: response }] }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Sorry, I encountered an error. Please make sure your API key is correctly set." }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const suggestedPrompts = [
    { title: "Explain quantum computing", icon: BrainCircuit, color: "text-blue-500 bg-blue-50" },
    { title: "Write a short story", icon: Sparkles, color: "text-purple-500 bg-purple-50" },
    { title: "Plan a trip to Tokyo", icon: Globe, color: "text-green-500 bg-green-50" },
    { title: "Help me debug my code", icon: Code, color: "text-gray-900 bg-gray-100" },
  ];

  return (
    <div className="flex h-screen w-full bg-white dark:bg-black transition-colors duration-300">
      <Sidebar onNewChat={handleNewChat} />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 z-40 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full pt-16">
                <Sidebar onNewChat={() => { handleNewChat(); setIsSidebarOpen(false); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex flex-1 flex-col relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/30 blur-[120px]" />
        </div>
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-4 md:px-6 backdrop-blur-md dark:border-gray-800 dark:bg-black/80 sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gemini Flash Assistant
            </h1>
            <span className="hidden sm:inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              v1.5 Flash
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-500">JD</span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar"
        >
          {messages.length === 0 ? (
            <div className="mx-auto max-w-2xl flex flex-col items-center justify-center h-full text-center py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/10 shadow-xl shadow-blue-500/5"
              >
                <Sparkles size={48} className="text-blue-600 animate-pulse" />
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
                Hello there!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-12">
                I'm your AI assistant powered by Gemini. Ask me anything or try a suggested topic below.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt.title}
                    onClick={() => handleSendMessage(prompt.title)}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50"
                  >
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all group-hover:scale-110", prompt.color)}>
                      <prompt.icon size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {prompt.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.parts[0].text}
                  />
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                    <Sparkles size={18} className="animate-spin text-blue-600" />
                  </div>
                  <div className="flex gap-1 items-center px-4 py-2.5 bg-gray-50 rounded-2xl dark:bg-gray-800/50">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
