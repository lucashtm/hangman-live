import express from 'express'
import http from 'http'
import tmi from 'tmi.js'
import socketio from 'socket.io'
import fs from 'fs'

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);
const connected = [];
let words;
fs.readFile('words.txt', 'utf8', (err, data) => {
  if(err) throw err;
  words = data.split('\n');
})

sockets.on('connection', socket => {
  console.log(`Client connected: ${socket.id}`);
  const word = words[Math.floor(Math.random()*words.length)].toUpperCase();
  socket.emit('setup', { word });
  connected.push(socket);
});

app.use(express.static('./'))

// Define configuration options
const opts = {
  identity: {
    username: 'hangryman2',
    password: 'pewkqq9w9si36aeby6cyuwt966i0k3'
  },
  channels: [
    'hangryman2'
  ]
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  const username = context.username;
  const letter = msg.trim().toUpperCase();
  if(isValidLetter(letter)){
    connected.forEach(socket => {
      socket.emit('new_letter', { letter, username });
    })
    console.log(`${username}: ${letter}`);
  }
}

function isValidLetter(letter){
    return letter.length === 1; // && letter.match(/^[a-z]+$/i);
}
// Function called when the "dice" command is issued
function printMessage () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

server.listen(3000, () => {
  console.log('Listening on port 3000');
});