const wordNode = document.getElementById('word');
const guessedNode = document.getElementById('guessed');
const playersNode = document.getElementById('players');
const socket = io();
let guessed = new Set();
let currentWord;

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

// const words = [
//     'FLIGHT',
//     'UNIVERSITY',
//     'INTERNET',
//     'MEANING',
//     'NEGOTIATION',
//     'PERSONALITY',
//     'LADY',
//     'CHURCH',
//     'PREFERENCE',
//     'WORLD',
//     'ROAD',
//     'GROWTH',
//     'MEAL',
//     'COOKIE',
//     'GATE',
//     'PAPER',
//     'MARRIAGE',
//     'REFLECTION',
//     'PROMOTION',
//     'INTENTION',
//     'PRESIDENT',
//     'OBLIGATION',
//     'COMPARISON',
//     'CHAPTER',
//     'OPPORTUNITY',
//     'SYSTEM',
//     'STUDIO',
//     'EFFORT',
//     'REVENUE',
//     'HOTEL',
//     'DRAMA',
//     'ENERGY',
//     'VIRUS',
//     'TONGUE',
//     'APPLICATION',
//     'SUGGESTION',
//     'CHEEK',
//     'POWER',
//     'MONTH',
//     'DEFINITION',
//     'EMPLOYER',
//     'LAB',
//     'DATABASE',
//     'BREAD',
//     'LEADER',
//     'BOYFRIEND',
//     'ASSOCIATION',
//     'MEDICINE',
//     'RECOMMENDATION',
//     'EXAMINATION',
// ];

socket.on('setup', data => {
    reset();
    console.log(data);
    setWord(data.word);
});

socket.on('connect', () => {
    const id = socket.id
    reset();
});

socket.on('new_letter', data => {
    let letterIndex = currentWord.indexOf(data.letter);
    console.log(letterIndex, data.letter);
    let hitCount = 0;
    while(letterIndex >= 0){
        wordNode.innerHTML = wordNode.innerHTML.replaceAt(letterIndex*2, data.letter);
        currentWord = currentWord.replaceAt(letterIndex, '*');
        letterIndex = currentWord.indexOf(data.letter);
        hitCount++;
    }
    if(hitCount > 0){
        const li = document.createElement('li');
        li.innerHTML = `${data.username}: ${data.letter}`;
        playersNode.appendChild(li);
    }
    if(wordNode.innerHTML.indexOf('_') < 0){
        wordNode.innerHTML += "  :)"
        setTimeout(reset, 2000);
    }
    guessed.add(data.letter);
    guessedNode.innerHTML = 'Guessed: ' + Array.from(guessed).join(' - ');
});

function setWord(word){
    // const wordId = Math.floor(Math.random(0, 1)*words.length);
    currentWord = word //words[wordId];
    // console.log(currentWord);
    wordNode.innerHTML = hideWord(currentWord);
}

function hideWord(word){
    return word.split('').map(_ => '_').join(' ');
}

function reset(){
    setWord();
    guessedNode.innerHTML = 'Guessed: ';
    guessed = new Set();
    playersNode.innerHTML = '';
}