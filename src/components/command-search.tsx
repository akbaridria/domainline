import { useState, useEffect } from "react";
import { Search, CommandIcon, Settings, FileText, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function CommandSearch() {
  const [isOpen, setIsOpen] = useState(false);

  // Handle Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="w-10 h-10 p-2 justify-center text-muted-foreground bg-transparent lg:w-full lg:justify-between lg:px-3 lg:h-auto"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline">Search...</span>
        </div>
        <div className="hidden lg:flex items-center gap-1 text-xs">
          <CommandIcon className="h-3 w-3" />
          <span>K</span>
        </div>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Open settings</span>
            </CommandItem>
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Create new file</span>
            </CommandItem>
            <CommandItem>
              <Palette className="mr-2 h-4 w-4" />
              <span>Toggle theme</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Recent">
            <CommandItem>
              <Search className="mr-2 h-4 w-4" />
              <span>Search documentation</span>
            </CommandItem>
            <CommandItem>
              <CommandIcon className="mr-2 h-4 w-4" />
              <span>Run command</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
