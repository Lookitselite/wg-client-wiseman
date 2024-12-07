

const name = "Aidan";
const game = "auto-" + name + "-" + randomInt(1000);

const alphabet = new Set("abcdefghijklmnopqrstuvwxyz".split(''));


require('core-js/actual');
let { Socket } = require('phoenix-channels');

let socket = new Socket("wss://words.homework.quest/socket", {debug: true});
socket.connect();


let channel = socket.channel("game:" + game, {name});

const fs = require('node:fs');
const zlib = require('zlib');
let words = zlib.gunzipSync(fs.readFileSync('words.txt.gz')).toString('utf-8').split("\n");

function randomInt(xx) {
  return Math.floor(xx * Math.random());
}

function randomPick(xs) {
  return xs[randomInt(xs.length)];
}

function patMatch(pat, word, guesses) {
  let pchs = pat.split('');
  let wchs = word.split('');

  if (pchs.length != wchs.length) {
    return false;
  }
  
  for (let ii = 0; ii < pchs.length; ++ii) {
    if (pchs[ii] == '-') {
      continue;
    }

    if (pchs[ii] != wchs[ii]) {
      // TODO: consider guesses
      return false;
    }
  }

  return true;
}

function onView(view) {
  const puzzle = view.puzzle;
  const guesses = new Set(view.guesses);
  const moves = Array.from(alphabet.difference(guesses));

  console.log("puzzle:", puzzle);
  console.log("guesses:", Array.from(guesses));
  console.log("moves:", moves);

  let pats = puzzle.split(" ");
  for (let pat of pats) {
    for (let word of words) {
      if (patMatch(pat, word, guesses)) {
        console.log(`pat [${pat}] could be [${word}]`);
        break;
      }
    }
  }
const conTest = Array.from("tnshrdlcwmfygpbvkxjqz");
const vowels = ["a", "e", "i", "o", "u"];
let removed = [];
function freqGuess (conTest, vowels, guesses){
 for (let xx of conTest) {
   if (guesses.has(xx)) {
        removed += conTest.splice(0,1);
	continue;
   } else if (guesses.length == conTest.length) {
      for (let xxx of vowels){
       guesses += xxx;
       return xxx;
      }
   } else {
       guesses += xx;
       return xx;
    }
 }
}
  let freqGuessChoice = freqGuess(conTest, vowels, guesses);
  let ch = randomPick(moves);
  console.log("guess:", freqGuessChoice);

  if (moves.length > 0 && puzzle.includes('-')) {
    channel.push("guess", {freqGuessChoice, freqGuessChoice});
  }
  else {
    console.log("done", view);
    process.exit();
  }
}

channel.join()
  .receive("ok", (msg) => console.log("Connected to game:", msg.game))
  .receive("error", (msg) => console.log("Error:", msg));

channel.on("view", onView);
