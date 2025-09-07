import { useMemo } from "react";
import { useChatContext } from "./chat-message/context/chat-context";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { useSearchParams } from "react-router";
import { useGetAllDomainsFromAddress } from "@/api/query";
import { SUPPORTED_CHAINS } from "@/config";
import { extractCAIP10, shortenAddress } from "@/lib/utils";
import { ClockIcon, Globe2Icon, User2Icon, ZapIcon } from "lucide-react";

const DialogSendOffer = () => {
  const { showOfferDialog, setShowOfferDialog } = useChatContext();
  const [searchParams] = useSearchParams();
  const rAddress = useMemo(() => {
    return searchParams.get("sender");
  }, [searchParams]);
  const { data } = useGetAllDomainsFromAddress(
    rAddress ? `eip155:97476:${rAddress}` : ""
  );

  const listDomains = useMemo(() => {
    if (!data) return [];
    return data.map((domain) => {
      const caip10Extracted = extractCAIP10(domain.claimedBy);
      const networkName =
        SUPPORTED_CHAINS.find(
          (chain) => chain.id === caip10Extracted?.networkId
        )?.name || "Unknown";
      return {
        name: domain.name,
        user: caip10Extracted?.accountAddress || "Unknown",
        network: networkName,
        expiredAt: domain.expiresAt,
        tokenAddress: domain?.tokens[0]?.tokenAddress,
        tokenId: domain?.tokens[0]?.tokenId,
      };
    });
  }, [data]);

  return (
    <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="font-semibold">Select Domain</div>
            <div className="p-4 bg-secondary rounded-lg">
              {listDomains.length === 0 && (
                <div className="text-sm text-muted-foreground text-center">
                  No domains found for this address.
                </div>
              )}
              {listDomains.map((domain) => (
                <div
                  key={domain.name}
                  className="p-4 border rounded-lg bg-accent hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe2Icon size={16} />
                        <div className="font-semibold underline underline-offset-4">
                          {domain.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon size={14} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(domain.expiredAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User2Icon size={16} />
                      <div className="text-sm">
                        {shortenAddress(domain.user, 6, 4)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ZapIcon size={16} />
                      <div className="text-sm">{domain.network}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>this is offer form</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSendOffer;
