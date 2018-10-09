console.log("Chrome extension ready to go.");

const voice = {
  index: 0,
  indexEnd: 0,
  sentences: [],
  synth: null,

  initialize: function() {
    if ("speechSynthesis" in window) {
      this.synth = new SpeechSynthesisUtterance();
      this.synth.lang = "en-US";
      this.synth.onend = function() {
        if (this.index < this.indexEnd) this.sayText();
        else speechSynthesis.cancel();
      };
      console.log("speech synth init complete.");
    } else console.log("Speech Synthesis not supported");
  },
  sayText: function() {
    if (!this.synth) return console.log("No Synth for sayText");
    this.synth.text = this.sentences[this.index++];
    speechSynthesis.speak(this.synth);
  },
  sayTextFromStart: function() {
    if (!this.synth) return console.log("No Synth for sayText");
    let textIn = this.getSelectedText();
    const text = [];
    if (!textIn || textIn.length === 0) text.push("Select text to speak.");
    else text.push(textIn);
    console.log(text);
    this.index = 0;
    this.indexEnd = text.length;
    this.sentences = text;
    this.sayText();
  },
  getSelectedText: function() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      activeElTagName == "textarea" ||
      (activeElTagName == "input" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
        typeof activeEl.selectionStart == "number")
    ) {
      text = activeEl.value.slice(
        activeEl.selectionStart,
        activeEl.selectionEnd
      );
    } else if (window.getSelection) {
      text = window.getSelection().toString();
    }
    return text;
  }
};
voice.initialize();

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(req, sender, resp) {
  console.log("Msg Revd");
  voice.sayTextFromStart();
}
