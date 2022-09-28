chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //   if (request.info === "hello") sendResponse({ farewell: "goodbye" });
  var range = document.getSelection()?.getRangeAt(0);
  console.log(request.info);
  if (range) {
    range.deleteContents();
    range.insertNode(document.createTextNode(`${request.info}`));
  }
});
