import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Web3Provider } from "./providers/web3-providers.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import AppProvider from "./providers/app-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Web3Provider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppProvider>
          <App />
        </AppProvider>
      </ThemeProvider>
    </Web3Provider>
  </StrictMode>
);
