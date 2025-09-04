import { useState, useEffect } from "react";
import {
  Search,
  CommandIcon,
  MessageCircle,
  Clock,
  User,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Web3Domain {
  domainName: string;
  owner: string;
  expired_at: Date;
}

const mockWeb3Domains: Web3Domain[] = [];

export function CommandSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  useEffect(() => {
    if (searchValue) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 800); // Simulate search delay

      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchValue]);

  const filteredDomains = mockWeb3Domains.filter(
    (domain) =>
      domain.domainName.toLowerCase().includes(searchValue.toLowerCase()) ||
      domain.owner.toLowerCase().includes(searchValue.toLowerCase())
  );

  const isExpired = (date: Date) => date < new Date();

  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleMessage = (domainName: string) => {
    console.log(`Navigating to message page for ${domainName}`);
    setIsOpen(false);
    // Here you would typically navigate to the messaging page
    // router.push(`/message/${domainName}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-10 h-10 p-2 justify-center text-muted-foreground bg-transparent lg:w-full lg:justify-between lg:px-3 lg:h-auto"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline">Search domains...</span>
        </div>
        <div className="hidden lg:flex items-center gap-1 text-xs">
          <CommandIcon className="h-3 w-3" />
          <span>K</span>
        </div>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search domains..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              </div>
              <h3 className="text-lg font-medium mb-2">Searching domains...</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Looking for domains matching "{searchValue}"
              </p>
            </div>
          ) : filteredDomains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Globe className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchValue ? "No domains found" : "No domains available"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchValue
                  ? `No domains match "${searchValue}". Try searching with a different term or domain name.`
                  : "Start by connecting your wallet or registering your first domain to see them here."}
              </p>
              {searchValue && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 bg-transparent"
                  onClick={() => setSearchValue("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <CommandGroup heading="Domains">
              {filteredDomains.map((domain) => (
                <CommandItem
                  key={domain.domainName}
                  className="flex items-center justify-between p-3"
                  onSelect={() => handleMessage(domain.domainName)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{domain.domainName}</span>
                        {isExpired(domain.expired_at) && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            Expired
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{truncateAddress(domain.owner)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{domain.expired_at.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessage(domain.domainName);
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
