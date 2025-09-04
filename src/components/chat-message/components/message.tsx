import { cn } from "@/lib/utils";
import { useChatContext } from "../context/chat-context";
import Avatar from "boring-avatars";
import { DEFAULT_COLORS_BORING_AVATAR } from "@/config";
import { Button } from "@/components/ui/button";
import { Send, User2Icon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Message = () => {
  const { showChat } = useChatContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `I received your message: "${userMessage.content}". This is a demo response!`,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={cn(
        "flex-1 border p-4 rounded-xl bg-white dark:bg-background transition-all w-full max-h-[calc(100%_-_var(--spacing)*2)]",
        showChat ? "block" : "hidden md:block"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name="eee" colors={DEFAULT_COLORS_BORING_AVATAR} size={40} />
          <div>
            <div className="text-sm">Unknown</div>
            <div className="text-xs text-muted-foreground">
              0x0a5863C53e9b7700F1DF9081D463631312E6fF42
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <User2Icon />
          </Button>
          <Button variant="outline">
            <XIcon />
          </Button>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100%_-_48px)] mt-4">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender !== "user" && (
                <Avatar
                  name="eee"
                  colors={DEFAULT_COLORS_BORING_AVATAR}
                  size={24}
                />
              )}

              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm  whitespace-pre-wrap">
                  {message.content}
                </p>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {message.sender === "user" && (
                <Avatar
                  name="fff"
                  colors={DEFAULT_COLORS_BORING_AVATAR}
                  size={24}
                />
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
        <div className="p-4">
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="w-full min-h-[40px] max-h-[120px] resize-none rounded-md border border-input bg-secondary px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="absolute right-2 bottom-4 h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
