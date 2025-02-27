import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/providers/ThemeProvider.tsx";
import { BungieHttpClientProvider } from "@/components/providers/BungieHttpClientProvider";
import { QueryClientProviderWrapper } from "@/components/providers/QueryClientProviderWrapper";
import { Toaster } from "@/components/providers/Toaster";

const containerId = "__season-pass-wayback-root";

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "inject") {
    injectContent();
  } else if (message.action === "remove") {
    document.getElementById(containerId)?.remove();
  }
});

function getTarget() {
  return document.querySelector(
    "[class^='SeasonPassRewardProgression_stepWrapper']"
  );
}

function injectContent() {
  if (
    !/:\/\/www\.bungie\.net\/7\/([^/]+\/)?Seasons\//.test(window.location.href)
  ) {
    return;
  }

  if (document.getElementById(containerId)) {
    return;
  }

  const container = document.createElement("div");
  container.id = containerId;
  document.body.appendChild(container);

  console.log("[D2SeasonPassWaybackMachine] Injecting script and styles...");

  const target = getTarget();
  if (target) {
    console.log(
      "[D2SeasonPassWaybackMachine] Target exists, injecting content..."
    );
    insertIntoDom(target, container);
  } else {
    console.log(
      "[D2SeasonPassWaybackMachine] Target not found, waiting for mutations..."
    );
    const observer = new MutationObserver((_, obs) => {
      const target = getTarget();
      if (target) {
        console.log(
          "[D2SeasonPassWaybackMachine] Target found, injecting content..."
        );
        obs.disconnect();
        insertIntoDom(target, container);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

function insertIntoDom(target: Element, container: HTMLDivElement) {
  target.insertAdjacentElement("afterend", container);

  let link = document.getElementById(
    "__season-pass-wayback-styles"
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = "__season-pass-wayback-styles";
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("assets/styles.css");
    link.onload = () => {
      console.log(
        "[D2SeasonPassWaybackMachine] Stylesheet successfully loaded."
      );
    };
    link.onerror = () => {
      console.error("[D2SeasonPassWaybackMachine] Failed to load styles.css.");
    };
  }
  document.head.appendChild(link);

  console.log("[D2SeasonPassWaybackMachine] Creating root...");
  createRoot(container).render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProviderWrapper>
          <BungieHttpClientProvider>
            <App />
            <Toaster />
          </BungieHttpClientProvider>
        </QueryClientProviderWrapper>
      </ThemeProvider>
    </StrictMode>
  );
}
