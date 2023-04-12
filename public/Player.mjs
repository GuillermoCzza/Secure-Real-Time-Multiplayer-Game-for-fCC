import constants from './constants.js';

class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
    //perform the movement
    switch(dir){
      case 'up':
        this.y -= speed;
        break;
        
      case 'down':
        this.y += speed;
        break;

      case 'left':
        this.x -= speed;
        break;

      case 'right':
        this.x += speed;
        break;
    }

    const maxXPosition = constants.BOARD_WIDTH - constants.PLAYER_WIDTH
    const maxYPosition = constants.BOARD_HEIGHT - constants.PLAYER_HEIGHT

    //wall collision
    if (this.x > maxXPosition){
      this.x = maxXPosition;
    } else if (this.x < 0){
      this.x = 0;
    }

    if (this.y > maxYPosition){
      this.y = maxYPosition;
    } else if (this.y < 0){
      this.y = 0;
    }
  }

  collision(item) {

  }

  calculateRank(playersArr) {

  }
}

export default Player;
