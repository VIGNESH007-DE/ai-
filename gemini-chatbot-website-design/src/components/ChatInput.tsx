import { useState, useRef, useEffect } from "react";
import { Send, Plus, Paperclip, Loader2 } from "lucide-react";
import { cn } from "../utils/cn";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="relative border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl flex items-end gap-2"
      >
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <Plus size={20} />
        </button>
        
        <div className="relative flex-1 group">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="w-full resize-none bg-gray-50 py-3 pl-4 pr-12 text-sm text-gray-900 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:ring-blue-600 transition-all duration-200"
          />
          <button
            type="button"
            className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Paperclip size={18} />
          </button>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300",
            input.trim() && !isLoading
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-100"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 scale-95 opacity-50"
          )}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Send size={18} className={cn(input.trim() && "translate-x-0.5")} />
          )}
        </button>
      </form>
      <div className="mt-2 text-center text-[10px] text-gray-400 dark:text-gray-500">
        Gemini Flash may provide inaccurate info.
      </div>
    </div>
  );
}
