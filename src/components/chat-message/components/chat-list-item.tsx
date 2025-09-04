import { DEFAULT_COLORS_BORING_AVATAR } from "@/config";
import Avatar from "boring-avatars";

const ChatListItem = () => {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-accent border-b cursor-pointer transition-all">
      <Avatar name="asd" size={40} colors={DEFAULT_COLORS_BORING_AVATAR} className="min-w-[40px]" />
      <div>
        <div className="text-sm">Chat Title</div>
        <div className="text-sm text-muted-foreground line-clamp-1">Last message preview Last message preview Last message preview Last message preview Last message preview</div>
      </div>
    </div>
  );
};

export default ChatListItem;
