import { cn } from "@/lib/utils";
import { useChatContext } from "../context/chat-context";

const Message = () => {
  const { showChat } = useChatContext();
  return (
    <div
      className={cn(
        "flex-1 border p-4 rounded-xl bg-white dark:bg-background transition-all w-full h-full",
        showChat ? "block" : "hidden md:block"
      )}
    >
      <div>oke gan disana</div>
    </div>
  );
};

export default Message;
