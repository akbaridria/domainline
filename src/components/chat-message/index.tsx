import ListChats from "./components/list-chats";
import Message from "./components/message";
import { ChatProvider } from "./context/chat-context";

const ChatMessage = () => {
  return (
    <ChatProvider>
      <div className="flex h-full md:p-4 p-2 gap-4">
        <ListChats />
        <Message />
      </div>
    </ChatProvider>
  );
};

export default ChatMessage;
