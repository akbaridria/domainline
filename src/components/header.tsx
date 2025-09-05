import { GithubIcon, GlobeIcon, MoonIcon, SunIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { CommandSearch } from "./command-search";
import { Button } from "./ui/button";
import Avatar from "boring-avatars";
import { useTheme } from "./theme-provider";
import { DEFAULT_COLORS_BORING_AVATAR } from "@/config";

const ToggleTheme = () => {
  const { setTheme, theme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        setTheme(
          document.documentElement.classList.contains("dark") ? "light" : "dark"
        )
      }
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

const Header = () => {
  return (
    <div className="px-4 py-2 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GlobeIcon size={16} />
            <div>domainLine</div>
          </div>
          <Separator orientation="vertical" className="min-h-4 min-w-0.5" />
          <CommandSearch />
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <GithubIcon />
          </Button>
          <ToggleTheme />
          <Separator orientation="vertical" className="min-h-4 min-w-0.5" />
          <Button size="icon" variant="ghost">
            <Avatar
              name="asd"
              colors={DEFAULT_COLORS_BORING_AVATAR}
              variant="beam"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
