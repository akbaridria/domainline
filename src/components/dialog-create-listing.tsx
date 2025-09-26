import { useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useGetAllDomainsFromAddress } from "@/api/query";
import {
  SUPPORTED_CHAINS,
  SUPPORTED_CURRENCIES,
  EXPIRATION_OPTIONS,
} from "@/config";
import { cn, extractCAIP10, shortenAddress } from "@/lib/utils";
import { InputWithSelect } from "./input-with-select";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  CheckCircle2Icon,
  ClockIcon,
  Globe2Icon,
  User2Icon,
  ZapIcon,
  AlertCircleIcon,
  PlusIcon,
} from "lucide-react";
import useCreateListing from "@/hooks/useCreateListing";
import { useAccount, useChainId } from "wagmi";
import { toast } from "sonner";
import { DropdownMenuItem } from "./ui/dropdown-menu";

interface Domain {
  name: string;
  user: string;
  network: string;
  expiredAt: string;
  tokenAddress: string;
  tokenId: string;
}

const DialogCreateListing = () => {
  const chainID = useChainId();
  const { address } = useAccount();
  const { createListing } = useCreateListing();

  const [open, setOpen] = useState(false);
  const [isLoadingListing, setIsLoadingListing] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [formListing, setFormListing] = useState({
    amount: "",
    currency: SUPPORTED_CURRENCIES[1].value,
    expiration: "7",
  });

  const { data } = useGetAllDomainsFromAddress(
    address ? `eip155:${chainID}:${address}` : ""
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

  const handleCreateListing = useCallback(async () => {
    try {
      console.log("Creating listing with:", { selectedDomain, formListing });
      setIsLoadingListing(true);
      if (!selectedDomain) return;
      if (!formListing.amount) return;
      const currencyName = SUPPORTED_CURRENCIES.find(
        (c) => c.value === formListing.currency
      )?.label;
      console.log("Currency Name:", currencyName);
      if (!currencyName) return;
      const networkId = SUPPORTED_CHAINS.find(
        (c) => c.name === selectedDomain.network
      )?.id;
      console.log("Network ID:", networkId);
      await createListing(
        selectedDomain?.tokenAddress || "",
        selectedDomain?.tokenId || "",
        formListing.currency,
        formListing.amount,
        Number(formListing.expiration) * 24 * 60 * 60 * 1000,
        networkId,
        () => {
          toast.success("Listing created successfully!");
          setSelectedDomain(null);
          setFormListing({
            amount: "",
            currency: SUPPORTED_CURRENCIES[1].value,
            expiration: "7",
          });
          setOpen(false);
        }
      );
      console.log("Listing created successfully");
      setIsLoadingListing(false);
    } catch {
      setIsLoadingListing(false);
      toast.error("Failed to create listing");
    }
  }, [selectedDomain, formListing, createListing]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
          className="cursor-pointer"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Listing
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Listing</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="font-semibold">Select Domain</div>
            <div className="p-4 border-dashed border-2 rounded-lg max-h-[400px] overflow-y-auto space-y-4">
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
                      <ClockIcon size={14} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(domain.expiredAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User2Icon size={16} />
                      <div className="text-sm">
                        {shortenAddress(domain.user, 6, 4)}
                      </div>
                      <ZapIcon size={16} />
                      <div className="text-sm">{domain.network}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="font-semibold">Listing Details</div>
            <div className="p-4 border-2 border-dashed rounded-lg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Amount</div>
                  <InputWithSelect
                    inputProps={{
                      placeholder: "Enter price",
                      value: formListing.amount,
                      onChange: (e) =>
                        setFormListing((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        })),
                    }}
                    selectProps={{
                      value: formListing.currency,
                      onValueChange: (value) =>
                        setFormListing((prev) => ({
                          ...prev,
                          currency: value,
                        })),
                    }}
                    selectOptions={SUPPORTED_CURRENCIES}
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Expiration</div>
                  <Select
                    value={formListing.expiration}
                    onValueChange={(value) =>
                      setFormListing((prev) => ({ ...prev, expiration: value }))
                    }
                  >
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
              {(!selectedDomain || !formListing.amount) && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircleIcon />
                  <AlertTitle>Unable to process your listing.</AlertTitle>
                  <AlertDescription>
                    <p>Please complete below information</p>
                    <ul className="list-inside list-disc text-sm">
                      {!selectedDomain && <li>Selected Domain</li>}
                      {!formListing.amount && <li>Listing Amount</li>}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              <Button
                className="w-full mt-4"
                onClick={handleCreateListing}
                disabled={
                  isLoadingListing || !selectedDomain || !formListing.amount
                }
              >
                {isLoadingListing ? "Processing..." : "Create Listing"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateListing;
