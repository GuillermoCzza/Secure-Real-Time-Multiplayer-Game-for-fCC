import Player from './public/Player.mjs';
import Collectible from './public/Collectible.mjs';
import constants from './public/constants.js';


module.exports = function (httpServer, app) {

  const io = require('socket.io')(httpServer);


  let currentPlayerNum = 0;
  let playerList = [];

  

  //connection
  io.on('connect', socket => {
    const socketID = socket.id;
    console.log("socket ID: " + socketID)
    
    //create player
    const posX = Math.floor(Math.random() * (constants.BOARD_WIDTH - constants.PLAYER_WIDTH));
    const posY = Math.floor(Math.random() * (constants.BOARD_HEIGHT - constants.PLAYER_HEIGHT));
    
    const player = new Player({x: posX, y: posY, score: 0, id: socketID});
    
    console.log(player);
    playerList.push(player);
    
    console.log('player connected. ID: ' + socketID);
    currentPlayerNum++;
    
    io.emit('new player', player); //send player so that emitter can identify it as own
    
    //when player moves, update in list
    socket.on('move', movedPlayer => {
      for (let player of playerList){
        if(player.id === movedPlayer.id){
          player.x = movedPlayer.x;
          player.y = movedPlayer.y;
          break;
        }
      }
    });

    //disconnection
    socket.on('disconnect', () => {
      currentPlayerNum--;
      playerList = playerList.filter(player => player.id != socketID); //remove disconnected player
      console.log(playerList);
    });
  });

  //game update function
  function updatePlayers(){
    io.emit('update', [playerList, currentPlayerNum]);
    console.log(playerList);
  }
  
  //game update loop
  const intervalId = setInterval(updatePlayers, 7); //send updates every 7 miliseconds

  //player behaviour

  //collectible behaviour

  //score tracking

  //rank updating
  
};