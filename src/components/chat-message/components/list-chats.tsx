import { cn } from "@/lib/utils";
import { useChatContext } from "../context/chat-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatListItem from "./chat-list-item";

const ListChats = () => {
  const { showChat } = useChatContext();
  return (
    <div
      className={cn(
        "flex flex-col flex-none border rounded-xl bg-white dark:bg-background transition-all w-full md:w-[400px] h-full max-h-[calc(100%_-_var(--spacing)*2)]",
        showChat ? "hidden md:block" : "block"
      )}
    >
      <div className="font-semibold text-2xl p-4">Chats</div>
      <ScrollArea className="flex-1 h-[calc(100%_-_64px)]">
        {Array.from({ length: 3 }).map((_, index) => (
          <ChatListItem key={index} />
        ))}
      </ScrollArea>
    </div>
  );
};

export default ListChats;
