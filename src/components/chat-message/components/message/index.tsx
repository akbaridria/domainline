import { cn } from "@/lib/utils";
import { useChatContext } from "../../context/chat-context";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../../types";
import Chat from "./components/chat";
import HeaderChat from "./components/header-chat";
import InputChat from "./components/input-chat";
// import NotRegistered from "./components/not-registered";

const Message = () => {
  const { showChat } = useChatContext();
  const [messages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "flex-1 border p-4 rounded-xl bg-white dark:bg-background transition-all w-full max-h-[calc(100%_-_var(--spacing)*2)]",
        showChat ? "block" : "hidden md:block"
      )}
    >
      <HeaderChat />
      <div className="flex flex-col h-[calc(100%_-_48px)] mt-4">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <Chat key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4">
          <InputChat />
        </div>
      </div>
    </div>
  );
};

export default Message;
