import { MessageSquare, LayoutGrid, Settings, Star, History, Sparkles } from "lucide-react";
import { cn } from "../utils/cn";

interface SidebarProps {
  onNewChat: () => void;
}

export function Sidebar({ onNewChat }: SidebarProps) {
  const items = [
    { icon: MessageSquare, label: "All Chats", active: true },
    { icon: LayoutGrid, label: "Explore Bots", active: false },
    { icon: History, label: "Recent Activity", active: false },
    { icon: Star, label: "Favorite Responses", active: false },
  ];

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-black/40 transition-colors duration-300">
      <div className="p-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={18} />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Gemini Flash
          </span>
        </div>

        <button
          onClick={onNewChat}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all hover:bg-gray-50 border border-gray-100 active:scale-95 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="mt-8 space-y-1">
          {items.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                item.active
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
