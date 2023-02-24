const voiceInputBtn = document.getElementById("voice-input-btn");
const textInput = document.getElementById("text-input");
const processingMsg = document.getElementById("processing-msg");
const answer = document.getElementById("answer");

const recognition = new window.webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-US";

voiceInputBtn.addEventListener("click", () => {
  recognition.start();
});

recognition.onstart = () => {
  console.log("Voice recognition activated");
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  textInput.value = transcript;
  submitQuestion(transcript);
};

textInput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    submitQuestion(textInput.value);
  }
});

function submitQuestion(question) {
  processingMsg.classList.remove("hidden");
  answer.classList.add("hidden");
  setTimeout(() => {
    getAnswer(question);
  }, 1500);
}

function getAnswer(question) {
  processingMsg.classList.add("hidden");
  answer.classList.remove("hidden");
  answer.innerHTML = "The answer to your question is..."; // replace with API call to get the answer
}

