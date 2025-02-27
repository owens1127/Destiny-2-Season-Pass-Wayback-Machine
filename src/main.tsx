import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BungieHttpClientProvider } from "./components/providers/BungieHttpClientProvider";
import { QueryClientProviderWrapper } from "./components/providers/QueryClientProviderWrapper";
import { Toaster } from "./components/providers/Toaster";

import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProviderWrapper>
      <BungieHttpClientProvider>
        <App />
        <Toaster />
      </BungieHttpClientProvider>
    </QueryClientProviderWrapper>
  </StrictMode>
);
