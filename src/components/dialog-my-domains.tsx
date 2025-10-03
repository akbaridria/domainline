import { useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAccount, useChainId } from "wagmi";
import { useGetAllDomainsFromAddress } from "@/api/query";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { CoinsIcon, Globe2Icon, User2Icon, ClockIcon } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/config";
import { extractCAIP10, shortenAddress } from "@/lib/utils";
import { formatUnits } from "viem";
import { useChatContext } from "./chat-message/context/chat-context";

interface Domain {
  name: string;
  network: string;
  expiredAt: string;
  listingPrice: string | null;
  listingExpiresAt: string;
  listingId: string;
}

interface DialogMyDomainsProps {
  onSendMessage: (message: string) => void;
}

const DialogMyDomains: React.FC<DialogMyDomainsProps> = ({ onSendMessage }) => {
  const chainID = useChainId();
  const { address } = useAccount();
  const { showMyDomainsDialog, setShowMyDomainsDialog } = useChatContext();
  const { data } = useGetAllDomainsFromAddress(
    address ? `eip155:${chainID}:${address}` : ""
  );

  const listListings = useMemo(() => {
    if (!data) return [];
    return data.flatMap((domain) => {
      const caip10 = extractCAIP10(domain.claimedBy);
      const networkName =
        SUPPORTED_CHAINS.find((chain) => chain.id === caip10?.networkId)
          ?.name || "Unknown";
      const listings = domain?.tokens?.[0]?.listings || [];
      return listings
        .filter(
          (listing) =>
            listing.price &&
            listing.currency &&
            listing.expiresAt &&
            new Date(listing.expiresAt) > new Date()
        )
        .map((listing) => ({
          name: domain.name,
          network: networkName,
          expiredAt: domain.expiresAt,
          listingPrice: `${formatUnits(
            BigInt(listing.price),
            listing.currency.symbol === "ETH" ? 18 : 6
          )} ${listing.currency.symbol}`,
          listingExpiresAt: listing.expiresAt,
          listingId: listing.externalId || "",
        }));
    });
  }, [data]);

  const handleSendOfferMessage = useCallback(
    (domain: Domain) => {
      if (domain.listingPrice) {
        onSendMessage(
          `offer_domain::${domain.name}::${address}::${domain.network}::${domain.listingPrice}::${domain.listingId}::${domain.listingExpiresAt}`
        );
        setShowMyDomainsDialog(false);
      }
    },
    [address, onSendMessage, setShowMyDomainsDialog]
  );

  return (
    <Dialog open={showMyDomainsDialog} onOpenChange={setShowMyDomainsDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Your Domains</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          <div className="flex flex-col gap-4">
            {listListings.length > 0 ? (
              listListings.map((listing) => (
                <div
                  key={listing.name}
                  className="p-4 border rounded-lg bg-accent hover:bg-accent/50 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Globe2Icon size={16} />
                    <span className="font-semibold">{listing.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon size={14} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(listing.expiredAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CoinsIcon size={16} />
                    <span className="text-sm">
                      {listing.listingPrice || "No price set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User2Icon size={16} />
                    <span className="text-sm">
                      {shortenAddress(address || "", 6, 4)}
                    </span>
                  </div>
                  {listing.listingPrice && (
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => handleSendOfferMessage(listing)}
                    >
                      Send Offer Message
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center">
                No domains found for your address.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogMyDomains;
