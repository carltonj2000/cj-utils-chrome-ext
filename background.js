console.log("background running");

chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab) {
  let msg = { txt: "speak" };
  chrome.tabs.sendMessage(tab.id, msg);
  console.log("button clicked.", tab);
}
