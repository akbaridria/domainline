import Layout from "@/components/layout";
import Header from "@/components/header";
import ChatMessage from "./components/chat-message";
import ConnectModal from "./components/connect-modal";
import { Toaster } from "sonner";

const App = () => {
  return (
    <Layout>
      <Header />
      <ChatMessage />
      <ConnectModal />
      <Toaster />
    </Layout>
  );
};

export default App;
