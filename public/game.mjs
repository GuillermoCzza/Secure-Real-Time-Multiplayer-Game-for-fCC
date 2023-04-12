import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

import constants from './constants.js';

import KeyboardController from './KeyboardController.js';

//draw board
context.fillStyle = "rgb(30, 30, 50)";
context.fillRect(0, 0, 640, 480);

context.fillStyle = "rgb(240, 240, 240)";
context.fillRect(constants.MARGIN, constants.MARGIN + constants.HUD_WIDTH,
  constants.BOARD_WIDTH + constants.BORDER_THICKNESS * 2, constants.BOARD_HEIGHT + constants.BORDER_THICKNESS * 2); //edge frame


let otherPlayers = [];

//when a new player is connected, check if it's oneself
//if it is, set up the game
socket.on('new player', newPlayer => {
  if (newPlayer.id == socket.id) {
    //I have to construct a new Player object because methods are lost
    //when passing an object through socket.io
    const player = new Player({ x: newPlayer.x, y: newPlayer.y, score: newPlayer.score, id: newPlayer.id });



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

    console.log("lo que viene despues se ejecuta");

    //When server sends update, update list and properties of players
    //except own (client master - server slave), but still update own score
    socket.on('update', ([playerList, currentPlayerNum]) => {
      for (let playerData of playerList) {
        if (playerData.id == socket.id) {
          player.score = playerData.score;
          break;
        }
      }
      otherPlayers = playerList.filter(player => player.id != socket.id);
    });



    //frame drawing function
    function drawFrame() {
      //draw play area
      context.fillStyle = "rgb(30, 30, 50)";
      context.fillRect(constants.MARGIN + constants.BORDER_THICKNESS, constants.MARGIN + constants.HUD_WIDTH + constants.BORDER_THICKNESS,
        constants.BOARD_WIDTH, constants.BOARD_HEIGHT);

      //draw the other players
      context.fillStyle = "rgb(190, 90, 90)";
      for (let playerData of otherPlayers) {
        context.fillRect(constants.MARGIN + constants.BORDER_THICKNESS + playerData.x,
          constants.MARGIN + constants.HUD_WIDTH + constants.BORDER_THICKNESS + playerData.y,
          constants.PLAYER_WIDTH, constants.PLAYER_HEIGHT);
      }

      //draw own player
      context.fillStyle = "rgb(90, 190, 90)";
      context.fillRect(constants.MARGIN + constants.BORDER_THICKNESS + player.x,
        constants.MARGIN + constants.HUD_WIDTH + constants.BORDER_THICKNESS + player.y,
        constants.PLAYER_WIDTH, constants.PLAYER_HEIGHT);
    }

    //Redraw scene every frame (should work up to 144hz)
    setInterval(drawFrame, 7);
  }
});

//collectible behaviour

//score tracking

//rank updating


