import Layout from "@/components/layout";
import Header from "@/components/header";
import ChatMessage from "./components/chat-message";
import ConnectModal from "./components/connect-modal";
import { Toaster } from "sonner";
import { Loader } from "lucide-react";
import useXmtp from "./hooks/useXmtp";

const App = () => {
  const { isLoadingXmtp } = useXmtp();
  return (
    <Layout>
      {isLoadingXmtp && (
        <div className="absolute z-[10] top-0 left-0 w-full h-full bg-background/50 pointer-events-auto transition-opacity backdrop-blur-xs">
          <div className="flex items-center justify-center h-full gap-2">
            <Loader size={16} className="animate-spin" />
            <div className="text-sm">Connecting to XMTP...</div>
          </div>
        </div>
      )}
      <Header />
      <ChatMessage />
      <ConnectModal />
      <Toaster />
    </Layout>
  );
};

export default App;
