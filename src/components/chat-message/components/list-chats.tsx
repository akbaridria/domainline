import { cn } from "@/lib/utils";
import { useChatContext } from "../context/chat-context";

const ListChats = () => {
  const { showChat } = useChatContext();
  return (
    <div
      className={cn(
        "flex-none border p-4 rounded-xl bg-white dark:bg-background transition-all w-full md:w-[400px] h-full",
        showChat ? "hidden md:block" : "block"
      )}
    >
      <div>oke gan disini</div>
    </div>
  );
};

export default ListChats;
