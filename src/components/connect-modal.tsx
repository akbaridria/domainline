import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import useApp from "@/hooks/useApp";
import { useModal } from "connectkit";
import { useAccount, useSignMessage } from "wagmi";
import { Client, type Signer } from "@xmtp/browser-sdk";
import { toBytes } from "viem";

type ConnectionStep = "wallet" | "xmtp" | "complete";

const ConnectModal = () => {
  const [open, onOpenChange] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConnectionStep>("wallet");
  const { open: openModalWallet, setOpen: setOpenModalWallet } = useModal();
  const { isConnecting, isConnected, address, isReconnecting } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { setXmtpClient, isAuthenticated, setIsAuthenticated } = useApp();
  const [isLoadingXmtp, setIsLoadingXmtp] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      onOpenChange(false);
    } else {
      onOpenChange(true);
    }
  }, [isAuthenticated, onOpenChange]);

  useEffect(() => {
    if (!isConnected) {
      setCurrentStep("wallet");
      setIsAuthenticated(false);
    }
  }, [isConnected, setIsAuthenticated]);

  const signer: Signer = useMemo(() => {
    return {
      type: "EOA",
      getIdentifier: () => ({
        identifier: address as string,
        identifierKind: "Ethereum",
      }),
      signMessage: async (message: string): Promise<Uint8Array> => {
        const signature = await signMessageAsync({
          account: address,
          message,
        });
        return toBytes(signature);
      },
    };
  }, [address, signMessageAsync]);

  const connectXmtp = useCallback(() => {
    try {
      setIsLoadingXmtp(true);
      Client.create(signer, { env: "dev" })
        .then((res) => {
          setXmtpClient(res);
          setCurrentStep("complete");
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingXmtp(false);
        });
    } catch (error) {
      console.error("Failed to create XMTP client:", error);
    }
  }, [setXmtpClient, signer]);

  const handleComplete = useCallback(() => {
    setIsAuthenticated(true);
  }, [setIsAuthenticated]);

  const handleOpenWallet = useCallback(() => {
    setOpenModalWallet(true);
  }, [setOpenModalWallet]);

  useEffect(() => {
    if (isConnected) {
      setCurrentStep("xmtp");
    } else {
      setCurrentStep("wallet");
    }
  }, [isConnected]);

  const progress = {
    wallet: {
      title: "Connect Your Wallet",
      description: "Connect your wallet to start trading domains.",
    },
    xmtp: {
      title: "Connect XMTP",
      description: "Enable messaging with other traders.",
    },
    complete: {
      title: "All Set!",
      description: "You're ready to trade domains.",
    },
  };

  const progressValue = {
    wallet: 33,
    xmtp: 66,
    complete: 100,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-balance">
            Welcome to{" "}
            <span className="text-primary underline underline-offset-4">
              domainLine
            </span>
          </DialogTitle>
          <div className="mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress[currentStep].title}</span>
                <span className="text-muted-foreground">
                  {Math.round(progressValue[currentStep])}%
                </span>
              </div>
              <Progress value={progressValue[currentStep]} className="w-full" />
              <div className="text-xs text-muted-foreground">
                {progress[currentStep].description}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {currentStep === "wallet" && (
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
                <CardDescription className="text-pretty">
                  Connect your Web3 wallet to start negotiating domain deals
                  securely on the blockchain.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleOpenWallet}
                  disabled={(isConnecting && openModalWallet) || isReconnecting}
                  className="w-full"
                  size="lg"
                >
                  {(isConnecting && openModalWallet) || isReconnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === "xmtp" && (
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Connect XMTP</CardTitle>
                <CardDescription className="text-pretty">
                  Enable secure, decentralized messaging to communicate with
                  other domain traders privately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={connectXmtp}
                  disabled={isLoadingXmtp}
                  className="w-full"
                  size="lg"
                >
                  {isLoadingXmtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Connect XMTP
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === "complete" && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">All Set!</CardTitle>
                <CardDescription className="text-pretty">
                  Your wallet and XMTP are connected. You're ready to start
                  negotiating domain deals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleComplete} className="w-full" size="lg">
                  Start Trading Domains
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModal;
