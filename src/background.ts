import * as DOMPurify from "dompurify";

async function summarizeWithGPT3(toSummarize: string) {
  const orgKey = (await chrome.storage.sync.get())["open_ai_org"];
  const apiKey = (await chrome.storage.sync.get())["open_ai_key"];
  const unableToSummarize = `Unable to summarize: ${toSummarize}`;

  if (!orgKey || !apiKey) {
    console.error("Open AI details not set or unable to be retrieved.");
    return `Open AI config not set. ${unableToSummarize}`;
  }

  // Using fetch instead of the OpenAI client because Chrome is picky about what runs in background scripts
  //
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: new Headers({
      Authorization: "Bearer " + apiKey,
      "OpenAI-Organization": `${orgKey}`,
      "Content-Type": "application/json",
    }),
    body: `{ "model": "text-davinci-002", "max_tokens": 1024, "prompt": "Summarize the following: ${toSummarize}"}`,
  });
  let body;
  if (response.status == 200) {
    body = await response.json();
    console.log(body.choices[0]);
  } else {
    console.log(
      `Request to OpenAI was unsuccessful with error code ${response.status}`
    );
    console.error(await response.json());
    return unableToSummarize;
  }

  const text = body.choices[0].text || unableToSummarize;
  // Don't want to accidentally XSS yourself with OpenAI
  return text;
}

async function updateDOM(summarized: string) {
  await chrome.tabs.query(
    { currentWindow: true, active: true },
    async function (tabArray) {
      const tabId = tabArray[0].id || 0;

      console.log(`Attempting to replace text on tab ${tabArray[0].id}`);
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content.js"],
      });
      // This is a hacky way of making this work
      // Basically the content script can't take in the summarized text as a parameter
      // So it needs to be passed as a message, but the message can't be sent until the content script has initialized
      await new Promise((resolve) => setTimeout(resolve, 200));
      await chrome.tabs.sendMessage(tabId, { info: summarized }, () => {});
    }
  );
}

async function onClickedHandler(tab: any): Promise<void> {
  const selection = tab.selectionText;
  const summarized = await summarizeWithGPT3(selection);
  // insert the summary into the DOM in place of the selection
  updateDOM(summarized);
}

chrome.contextMenus.create({
  id: "1",
  title: "Melange: Summarize",
  contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(onClickedHandler);
