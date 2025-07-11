
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg max-w-md",
        message.isUser
          ? "ml-auto bg-purple-600 text-white"
          : message.isError
          ? "bg-red-500/20 text-red-300 border border-red-500/30"
          : "bg-white/10 text-gray-200 border border-white/20"
      )}
    >
      <div className="flex-1">
        <p className="text-sm">{message.text}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
