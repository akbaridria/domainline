import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout";
import Header from "@/components/header";
import ChatMessage from "./components/chat-message";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <Header />
        <ChatMessage />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
