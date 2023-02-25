const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;

const voiceInputBtn = document.getElementById('voice-input-btn');
const textInput = document.getElementById('text-input');
const submitBtn = document.getElementById('submit-btn');
const answerContainer = document.getElementById('answer-container');

voiceInputBtn.addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', (e) => {
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join('');

  textInput.value = transcript;
});

submitBtn.addEventListener('click', () => {
  const question = textInput.value;
  if (question.trim() === '') {
    return;
  }

  const answer = getAnswer(question);
  answerContainer.innerHTML = `<p><strong>Your question:</strong> ${question}</p><p><strong>Answer:</strong> ${answer}</p>`;
});

function getAnswer(question) {
  // Replace this function with your own code that generates an answer based on the question
  return 'This is the answer to your question.';
}
