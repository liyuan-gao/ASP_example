var isClose=true;
        const stopwords = ["of", "the", "a", "an", "any", "is", "can", "who", "what", "why", "whom"];
        var editor = "sorts\n" +
            "    #people = {tommy, alex, john, daniel, sarah, peter, lino}.\n" +
            "    #gender = {male, female}.\n" +
            "predicates\n" +
            "    advisor(#people, #people).\n" +
            "    friend(#people, #people).\n" +
            "    gender(#people,#gender).\n" +
            "    spanish(#people).\n" +
            "rules\n" +
            "    advisor(tommy, alex).\n" +
            "    advisor(tommy, john).\n" +
            "    advisor(tommy, daniel).\n" +
            "    advisor(tommy, lino).\n" +
            "    friend(lino, alex).\n" +
            "    friend(lino, peter).\n" +
            "    friend(sarah, alex).\n" +
            "    friend(X, Y):-friend(Y,X).\n" +
            "    gender(tommy,male).\n" +
            "    gender(lino,male).\n" +
            "    gender(sarah, female).\n" +
            "    spanish(lino).";
        // sorts
        var contstring = editor.split("sorts\n")[1].split("predicates\n");
        var sortstring = contstring[0].split('.');
        sortstring.splice(-1, 1);
        var sorts = {};
        sortstring = sortstring.map(d => d.replace(/\n/g, '').trim()).forEach(d => {
            var par = d.split("=");
            sorts[par[0].replace(/#/, '').trim()] = par[1].replace(/{|}/g, '').split(',').map(w => w.trim())
        });
        // predicates
        var predicates = {};
        contstring = contstring[1].split("rules\n");
        sortstring = contstring[0].split('.');
        sortstring.splice(-1, 1);
        sortstring.forEach(d => {
            var part = d.replace(/\n/g, '').trim().split('(');
            var func = part[0];
            predicates[func] = {};
            var par = part[1].split(',').map(e => e.replace(/#|\)/g, '').trim());
            var par1 = sorts[par[0]].slice();
            par1.push("X");
            par.splice(0, 1);
            par1.forEach(e => {
                var strinh = (e == 'X' ? '' : (e + ' ')) + func;
                predicates[func][strinh] = func + "(" + e + ")";
                par.forEach(par2 => {
                    var temp = sorts[par2].slice();
                    temp.push("X");
                    temp.forEach(t => {
                        var strinh = (e == 'X' ? '' : (e + ' ')) + func + (t == 'X' ? '' : (' ' + t));
                        // if (strinh != fubnc)
                        predicates[func][strinh] = func + "(" + e + "," + t + ")";
                    })
                });
            });
        });


        var all_predicates = [];
        for (var key1 in predicates) {
            if (predicates.hasOwnProperty(key1)) {
                for (var key2 in predicates[key1]) {
                    if (predicates[key1].hasOwnProperty(key2))
                        all_predicates.push(key2);
                }
            }

        }
        all_predicates.push('speak spanish'); // extra terms
        a = FuzzySet(all_predicates);

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
  var result = a.get(transcript.join(" "), null, 0.5);
  
   if (result!=null) {
                var mainkey = result[0][1].replace('speak ','');
                var answerarr = mainkey.split(' ');
                var key1 = '';
                answerarr.forEach(d => {
                    key1 = (predicates[d] != undefined) ? d : key1;
                });
                //var key1 = answerarr.length>2? answerarr[1]:answerarr[0];
                var key2 = mainkey;
                console.log(key1 +'-'+ key2);
                console.log(predicates[key1][key2]);
                var utterThis = new SpeechSynthesisUtterance(key2);
                synth.speak(utterThis);

                var data = {
                    'action': "getQuery",
                    'query': predicates[key1][key2],
                    'editor': editor
                };

                // Expected response : answer sets
                $.post("http://wave.ttu.edu/ajax.php", data, function (response) {
                    console.log(response);
                    var html = document.createElement("html");
                    html.innerHTML = response;
                    // contentRan
                    var answerstring = html.querySelector("p").textContent.replace(/X =/gm, "");
                    var answerarr = answerstring.split("\n");
                    answerarr.splice(-1,1);
                    console.log(answerarr);
                    var pre_string = "The answer to your question " + transcript + " is ";
                    answerstring = contentRan.answer[answerarr[0].toLowerCase().trim()]==undefined?
                        (pre_string + (answerarr.length==1?answerstring:(answerarr.splice(-1, 0, "and"),answerarr.join())))
                        : generaspeak(contentRan.answer[answerarr[0].toLowerCase().trim()]);
                    console.log(answerstring);
                    Speaking(answerstring);
                });
            }else{
                Speaking(generaspeak(contentRan.unknowncommand));
            }
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
  answerBox.style.display = "block"; // add this line
  answer.innerHTML = "The answer to your question is..."; // replace with API call to get the answer
}


