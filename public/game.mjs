import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import constants from './constants.js';
import KeyboardController from './KeyboardController.js';
import Renderer from './Renderer.js';

const renderer = new Renderer();
const socket = io();

let otherPlayers = [];
let currentCoin;

//when a new player is connected, check if it's oneself
//if it is, set up the game
socket.on('new player', ([newPlayer, preExistingCoin]) => {
  if (newPlayer.id == socket.id) {
    //I have to construct a new Player object because methods are lost
    //when passing an object through socket.io
    const player = new Player({ x: newPlayer.x, y: newPlayer.y, score: newPlayer.score, id: newPlayer.id });

    currentCoin = preExistingCoin;

    //player movement function
    function move(moveDir) {
      player.movePlayer(moveDir, constants.PLAYER_SPEED);
      socket.emit('move', player);
    }

    KeyboardController({ //detect input keys
      37: () => { move('left'); },
      38: () => { move('up'); },
      39: () => { move('right'); },
      40: () => { move('down'); }
    }, 7 /*repeat delay in milis*/);

    //When server sends update, update list and properties of players
    //except own (client master - server slave), but still update own score
    socket.on('players update', (playerList) => {
      for (let playerData of playerList) {
        if (playerData.id == socket.id) {
          player.score = playerData.score;
          break;
        }
      }
      otherPlayers = playerList.filter(player => player.id != socket.id);
    });

    socket.on('new coin', coin => {
      currentCoin = coin;
    });


    //Redraw scene every frame (should work fine up to 144hz)
    setInterval(function(){
      return renderer.drawFrame(player, otherPlayers, currentCoin);
    }, 7);
  }
});

//collectible behaviour

//score tracking

//rank updating


