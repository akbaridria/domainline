import { useMemo, useState } from "react";
import { useChatContext } from "./chat-message/context/chat-context";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { useSearchParams } from "react-router";
import { useGetAllDomainsFromAddress } from "@/api/query";
import {
  EXPIRATION_OPTIONS,
  SUPPORTED_CHAINS,
  SUPPORTED_CURRENCIES,
} from "@/config";
import { cn, extractCAIP10, shortenAddress } from "@/lib/utils";
import {
  CheckCircle2Icon,
  ClockIcon,
  Globe2Icon,
  User2Icon,
  ZapIcon,
} from "lucide-react";
import { InputWithSelect } from "./input-with-select";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

interface Domain {
  name: string;
  user: string;
  network: string;
  expiredAt: string;
  tokenAddress: string;
  tokenId: string;
}

const DialogSendOffer = () => {
  const { showOfferDialog, setShowOfferDialog } = useChatContext();
  const [searchParams] = useSearchParams();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="font-semibold">Select Domain</div>
            <div className="p-4 border-dashed border-2 rounded-lg h-screen max-h-[400px] overflow-y-auto space-y-4">
              {listDomains.length === 0 && (
                <div className="text-sm text-muted-foreground text-center">
                  No domains found for this address.
                </div>
              )}
              {listDomains.map((domain) => (
                <div
                  key={domain.name}
                  className={cn(
                    "p-4 border rounded-lg bg-accent hover:bg-accent/50 transition-colors cursor-pointer",
                    selectedDomain?.name === domain.name &&
                      "bg-accent/50 border-dashed"
                  )}
                  onClick={() => {
                    if (selectedDomain?.name === domain.name) {
                      setSelectedDomain(null);
                    } else {
                      setSelectedDomain(domain);
                    }
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe2Icon size={16} />
                        <div className="font-semibold underline underline-offset-4">
                          {domain.name}
                        </div>
                      </div>
                      {selectedDomain?.name === domain.name && (
                        <CheckCircle2Icon className="fill-green-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon size={16} />
                      <span className="text-sm">
                        {new Date(domain.expiredAt).toLocaleDateString()}
                      </span>
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
          <div className="space-y-4">
            <div className="font-semibold">Offer Details</div>
            <div className="p-4 border-2 border-dashed rounded-lg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Amount</div>
                  <InputWithSelect
                    inputProps={{ placeholder: "Enter price" }}
                    selectProps={{ value: SUPPORTED_CURRENCIES[0].value }}
                    selectOptions={SUPPORTED_CURRENCIES}
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Expiration</div>
                  <Select value="7">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPIRATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full mt-4">Send Offer</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSendOffer;
