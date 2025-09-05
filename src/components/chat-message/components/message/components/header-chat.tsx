import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_COLORS_BORING_AVATAR } from "@/config";
import Avatar from "boring-avatars";
import { EllipsisIcon, ForwardIcon, LogOutIcon, User2Icon } from "lucide-react";

const HeaderChat = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar
          name="asd"
          colors={DEFAULT_COLORS_BORING_AVATAR}
          size={40}
          variant="beam"
        />
        <div>
          <div className="text-sm">Unknown</div>
          <div className="text-xs text-muted-foreground">
            0x0a5863C53e9b7700F1DF9081D463631312E6fF42
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User2Icon />
              <div className="text-sm">View Profile</div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ForwardIcon />
              <div className="text-sm">Send Offers</div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOutIcon />
              <div className="text-sm">Exit chat</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HeaderChat;
