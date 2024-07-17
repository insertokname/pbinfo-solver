
const problem_page = 'https://www.pbinfo.ro/probleme/';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "find-solution",
    title: "Find Solution",
    contexts: ["action"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "find-solution") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: () => {
        Editor.setValue("temp")
      },
      world: 'MAIN',
    });
  }
});

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(problem_page)) {

    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: () => {
        Editor.setValue("click")
      },
      world: 'MAIN',
    });
  }
});
