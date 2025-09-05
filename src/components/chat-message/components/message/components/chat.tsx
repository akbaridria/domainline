import type { Message } from "@/components/chat-message/types";
import { DEFAULT_COLORS_BORING_AVATAR } from "@/config";
import Avatar from "boring-avatars";
import { useMemo } from "react";
import { useAccount } from "wagmi";

interface ChatProps {
  message: Message;
}

const Chat: React.FC<ChatProps> = ({ message }) => {
  const { address } = useAccount();
  const isCurrentUser = useMemo(() => {
    return message.sender === address;
  }, [message, address]);

  return (
    <div
      className={`flex gap-3 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isCurrentUser && (
        <Avatar
          name={message.sender}
          colors={DEFAULT_COLORS_BORING_AVATAR}
          size={24}
          variant="beam"
        />
      )}

      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 ${
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <p className="text-sm  whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-70">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isCurrentUser && (
        <Avatar
          name={message.sender}
          colors={DEFAULT_COLORS_BORING_AVATAR}
          size={24}
          variant="beam"
        />
      )}
    </div>
  );
};

export default Chat;
