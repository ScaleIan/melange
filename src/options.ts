const updateStatus = (newStatus: string) => {
  const status = document.getElementById("status");
  if (status) {
    status.textContent = newStatus;
  }
};

const saveOptions = () =>
  new Promise((resolve, reject) => {
    var openAiKey = (<HTMLInputElement>document?.getElementById("key"))?.value;
    var openAiOrg = (<HTMLInputElement>document?.getElementById("org"))?.value;
    return chrome.storage.sync.set(
      { open_ai_key: openAiKey, open_ai_org: openAiOrg },
      () =>
        chrome.runtime.lastError
          ? reject(Error(chrome.runtime.lastError.message))
          : resolve(() => {
              return updateStatus("Options saved.");
            })
    );
  });

const resetOptions = () =>
  new Promise((resolve, reject) => {
    return chrome.storage.sync.clear(() =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(() => {
            return updateStatus("Options reset and storage cleared.");
          })
    );
  });

document.getElementById("reset")?.addEventListener("click", resetOptions);
document.getElementById("save")?.addEventListener("click", saveOptions);
