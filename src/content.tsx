import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import App from "./App.tsx";
import { BungieHttpClientProvider } from "@/components/providers/BungieHttpClientProvider";
import { QueryClientProviderWrapper } from "@/components/providers/QueryClientProviderWrapper";
import { Toaster } from "sonner";

function getInjectionTarget() {
  return document.querySelector(
    "[class^='SeasonPassRewardProgression_stepWrapper']"
  );
}

const logger = {
  log: console.log.bind(console, "[D2SeasonPassWaybackMachine]"),
  error: console.error.bind(console, "[D2SeasonPassWaybackMachine]"),
};

const app = document.createElement("div");
app.id = "Destiny2-SeasonPass-Wayback-Machine--Root";
document.body.appendChild(app);

let isInjecting = false;
injectContent();

const observer = new MutationObserver(() => {
  if (
    !isInjecting &&
    /:\/\/www\.bungie\.net\/7\/([^/]+\/)?Seasons\//.test(
      window.location.href
    ) &&
    !document.body.contains(app)
  ) {
    logger.log("Container removed from DOM, re-injecting");
    injectContent();
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

function injectContent() {
  logger.log("Attempting to inject content and styles");
  isInjecting = true;

  const target = getInjectionTarget();
  if (target) {
    logger.log("Target exists, injecting content");
    insertIntoDom(target);
  } else {
    logger.log("Target not found, waiting for mutations");
    const observer = new MutationObserver((_, obs) => {
      const target = getInjectionTarget();
      if (target) {
        logger.log("Target found, injecting content");
        obs.disconnect();
        insertIntoDom(target);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

let root: Root | null = null;

function insertIntoDom(target: Element) {
  target.insertAdjacentElement("afterend", app);

  const stylesId = "Destiny2-SeasonPass-Wayback-Machine--Styles";
  let link = document.getElementById(stylesId) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = stylesId;
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("assets/styles.css");
    link.onerror = () => {
      logger.error("Failed to load stylesheet");
    };
    document.head.appendChild(link);
  }

  if (!root) {
    logger.log("Creating root");
    root = createRoot(app);
  }
  root!.render(
    <StrictMode>
      <QueryClientProviderWrapper>
        <BungieHttpClientProvider>
          <App />
          <Toaster richColors duration={7777} />
        </BungieHttpClientProvider>
      </QueryClientProviderWrapper>
    </StrictMode>
  );

  logger.log("Content successfully injected");

  isInjecting = false;
}
