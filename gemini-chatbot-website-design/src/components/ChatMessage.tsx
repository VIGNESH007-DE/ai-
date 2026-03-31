import { useState } from "react";
import { User, Sparkles, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

interface ChatMessageProps {
  role: "user" | "model";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-3 mb-6 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border shadow-sm transition-colors",
          isUser
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        )}
      >
        {isUser ? <User size={18} /> : <Sparkles size={18} />}
      </div>
      <div className="relative max-w-[80%] group">
        <div
          className={cn(
            "whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-white text-gray-800 border border-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800 rounded-tl-none"
          )}
        >
          {content}
        </div>
        {!isUser && (
          <button
            onClick={handleCopy}
            className="absolute -right-10 top-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
