import Player from './public/Player.mjs';
import Collectible from './public/Collectible.mjs';
import constants from './public/constants.js';


module.exports = function (httpServer, app) {

  const io = require('socket.io')(httpServer);

  //function to create collectibles
  function createCoin(){
    const posX = Math.floor(Math.random() * (constants.BOARD_WIDTH - constants.COIN_WIDTH ));
    const posY = Math.floor(Math.random() * (constants.BOARD_HEIGHT - constants.COIN_HEIGHT));
    
    //coin ID will be creation timestamp
    const coinID = Date.now();

    const coinValue = Math.floor(Math.random() * constants.COIN_MAX_VALUE) + 1;

    return new Collectible({x: posX, y: posY, value: coinValue, id: coinID});
  }

  //function to create new players
  function createPlayer(newID){
    const posX = Math.floor(Math.random() * (constants.BOARD_WIDTH - constants.PLAYER_WIDTH));
    const posY = Math.floor(Math.random() * (constants.BOARD_HEIGHT - constants.PLAYER_HEIGHT));
    
    return new Player({x: posX, y: posY, score: 0, id: newID})
  }

  //function to check for collision between a player and a coin
  function hasCollided(player, coin){
    return (player.x < coin.x + constants.COIN_WIDTH &&
      player.x + constants.PLAYER_WIDTH > coin.x &&
      player.y < coin.y + constants.COIN_HEIGHT &&
      constants.PLAYER_HEIGHT + player.y > coin.y)
  }


  let currentCoin = createCoin();
  let playerList = [];
  

  //connection
  io.on('connect', socket => {
    const socketID = socket.id;
    console.log('Player connected. ID: ' + socketID);
    
    const player = createPlayer(socketID);
    playerList.push(player);

    //send player so that emitter can identify it as own, and current coin so he can see it and pick it up
    io.emit('new player', [player, currentCoin]);
    
    //when player moves, update in list
    socket.on('move', movedPlayer => {
      for (let player of playerList){
        if(player.id === movedPlayer.id){
          player.x = movedPlayer.x;
          player.y = movedPlayer.y;

          //check for collision with coin
          if (hasCollided(player, currentCoin)) {
            player.score += currentCoin.value;
            currentCoin = createCoin(); //replace coin for new one
            io.emit('new coin', currentCoin);
          }
          

          break;
        }
      }
    });

    //disconnection
    socket.on('disconnect', () => {
      playerList = playerList.filter(player => player.id != socketID); //remove disconnected player
    });
  });

  //game update function
  function updatePlayers(){
    io.emit('players update', playerList);
  }
  
  //game update loop
  const intervalId = setInterval(updatePlayers, 7); //send updates every 7 miliseconds

  //collectible spawning
  
  //score tracking
  
};