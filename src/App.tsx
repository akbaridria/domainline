import Layout from "@/components/layout";
import Header from "@/components/header";
import ChatMessage from "./components/chat-message";
import ConnectModal from "./components/connect-modal";
import { Toaster } from "sonner";
import useXmtp from "./hooks/useXmtp";
import DialogProfile from "./components/dialog-profile";
import ConnectXMTPLoader from "./components/connecti-xmtp-loader";
import { useAccount } from "wagmi";
import ConnectionWalletLoader from "./components/connection-wallet-loader";

const App = () => {
  const { isLoadingXmtp } = useXmtp();
  const { status } = useAccount();
  return (
    <Layout>
      {isLoadingXmtp && <ConnectXMTPLoader />}
      {status === "connecting" && <ConnectionWalletLoader />}
      <Header />
      <ChatMessage />
      <ConnectModal />
      <DialogProfile />
      <Toaster />
    </Layout>
  );
};

export default App;
