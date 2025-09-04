import Layout from "@/components/layout";
import Header from "@/components/header";
import ChatMessage from "./components/chat-message";
import ConnectModal from "./components/connect-modal";

const App = () => {
  return (
    <Layout>
      <Header />
      <ChatMessage />
      <ConnectModal />
    </Layout>
  );
};

export default App;
