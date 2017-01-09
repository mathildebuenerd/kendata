

// P5bots script
var b = p5.board('/dev/ttyACM0', 'arduino');
var led;



function setup() {

	led = b.pin(9, 'LED');

}

function keyPressed() {

 if (keyCode === LEFT_ARROW){
    led.on();
  } else if (keyCode === RIGHT_ARROW) {
    led.off();
   }//else if (keyCode === UP_ARROW){
  //   led.blink();
  //   console.log('Hello, World!')
  // } else if (keyCode === DOWN_ARROW) {
  //   led.noBlink();
  // }

}


var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

var grammar = '#JSGF V1.0; grammar wordsToFind; public <wordsToFind> = putain | encule | va te faire | foutre | tais-toi | foutre ';

// confond souvent "putain" avec "je t'aime"
// cherche les * car l'API remplace les insultes par des "***********"
 var wordsToFind = ["putain", /encul./, "va te faire", "foutre", "méchant", /\*/, "70", "90"];


if ('webkitSpeechRecognition' in window) {

  // start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.continuous = true;
  recognition.interimResults = true;

    
// Set grammar parameters
  var speechRecognitionList = new webkitSpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  // ne montre pas les résultats intermédiaires mais du coup prend plus de temps à afficher le résultat final
  // recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  // affiche la variable grammar
  console.log(speechRecognitionList[0].src); 

  recognition.onstart = function() {
    recognizing = true;
  };

  // permet de redémarrer la recognition quand elle s'arrête 
  recognition.onend = function() {
    // recognizing = true;
    console.log("je me suis arrêté");
    startButton(event);
  };



  recognition.onresult = function(event) {
    // foundWords = "";
    var interim_transcript = '';
    var last = event.results.length - 1;

    var foundWords = event.results[last][0].transcript;

    for (var i=0; i<wordsToFind.length; i++) {
      
    var maRegex = new RegExp(wordsToFind[i], "gi");

      var monTableau;

      // Tant que l'on trouve un des mots de la liste dans les foundWords
      if ((monTableau = maRegex.exec(foundWords)) !== null) {
        console.log("il a dit " + maRegex + " !!!");
        led.on();

        // éteint la led au bout d'1 seconde
        setTimeout(function() {
          led.off();
        }, 1000);

      }
    }

    console.log("foundWords " + foundWords);
  // console.log("isFinal " + event.results[last][0].transcript);

        
  };
}


function startButton(event) {
  
  // if (recognizing) {
    recognition.stop();
    // return;
  // }

  final_transcript = '';
  recognition.start();
  // ignore_onend = false;
  // start_timestamp = event.timeStamp;
}