let enabled = true;

chrome.storage.local.get("enabled", (result) => {
  enabled = result.enabled ?? true;
});

chrome.runtime.onInstalled.addListener(() => {
  enabled = true;
  chrome.storage.local.set({ enabled });
});

chrome.action.onClicked.addListener((tab) => {
  enabled = !enabled;
  chrome.storage.local.set({ enabled });
  chrome.tabs.sendMessage(tab.id!, { action: enabled ? "inject" : "remove" });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (enabled && changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { action: "inject" });
  }
});
