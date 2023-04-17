import constants from "./constants.js";
class Renderer {
    //frame drawing function
    constructor (){
        this.greenCatSprite = new Image();
        this.greenCatSprite.src = "../assets/green-cat.png"
        this.redCatSprite = new Image();
        this.redCatSprite.src = "../assets/red-cat.png"
    }

    drawFrame(player, otherPlayers, coin) {
        const canvas = document.getElementById('game-window');
        const context = canvas.getContext('2d');

        //draw board
        context.fillStyle = "rgb(30, 30, 50)";
        context.fillRect(0, 0, constants.MARGIN * 2 + constants.BORDER_THICKNESS * 2 + constants.BOARD_WIDTH, constants.MARGIN * 2 + constants.HUD_WIDTH + constants.BORDER_THICKNESS * 2 + constants.BOARD_HEIGHT);

        context.fillStyle = "rgb(240, 240, 240)";
        context.fillRect(constants.MARGIN, constants.MARGIN + constants.HUD_WIDTH,
            constants.BOARD_WIDTH + constants.BORDER_THICKNESS * 2, constants.BOARD_HEIGHT + constants.BORDER_THICKNESS * 2); //edge frame

        context.font = '24px Sans-Serif';
        context.fillText("Controls: Arrow Keys", constants.MARGIN, constants.HUD_WIDTH); //controls text

        //draw rank and score text
        context.fillStyle = "rgb(240, 240, 240)";
        context.fillText("Rank: " + player.calculateRank(otherPlayers), constants.MARGIN + constants.BOARD_WIDTH / 2, constants.HUD_WIDTH);
        context.fillText("Score: " + player.score, constants.MARGIN + constants.BOARD_WIDTH * 3 / 4, constants.HUD_WIDTH);

        //draw play area
        context.fillStyle = "rgb(30, 30, 50)";
        context.fillRect(constants.MARGIN + constants.BORDER_THICKNESS, constants.MARGIN + constants.HUD_WIDTH + constants.BORDER_THICKNESS,
            constants.BOARD_WIDTH, constants.BOARD_HEIGHT);

        //draw the other players
        context.fillStyle = "rgb(190, 90, 90)";
        for (let playerData of otherPlayers) {
            context.drawImage(this.redCatSprite,
                constants.MARGIN + constants.BORDER_THICKNESS + playerData.x,
                constants.MARGIN + constants.HUD_WIDTH + constants.BORDER_THICKNESS + playerData.y,
                constants.PLAYER_WIDTH,
                constants.PLAYER_HEIGHT);
        }

        //draw own player
        context.drawImage(this.greenCatSprite,
            constants.MARGIN + constants.BORDER_THICKNESS + player.x,
            constants.MARGIN + constants.HUD_WIDTH + constants.BORDER_THICKNESS + player.y,
            constants.PLAYER_WIDTH,
            constants.PLAYER_HEIGHT);

        //draw coin
        let coinColor;
        switch (coin.value){
            case 1:
                coinColor = "rgb(244, 255, 0)"
                break;
            case 2:
                coinColor = "rgb(250, 215, 0)"
                break;
            case 3:
                coinColor = "rgb(254, 174, 0)"
                break;
            default:
                coinColor = "rgb(77, 234, 209)"
        }
        context.fillStyle = coinColor;
        context.beginPath();
        context.arc(constants.MARGIN + constants.BORDER_THICKNESS + constants.COIN_WIDTH/2 + coin.x,
            constants.MARGIN + constants.HUD_WIDTH + constants.BORDER_THICKNESS + constants.COIN_WIDTH/2 + coin.y,
            constants.COIN_WIDTH/2, 0, Math.PI * 2);
        context.closePath();
        context.fill();
        /*context.fillRect(constants.MARGIN + constants.BORDER_THICKNESS + coin.x,
            constants.MARGIN + constants.HUD_WIDTH + constants.BORDER_THICKNESS + coin.y,
            constants.COIN_WIDTH, constants.COIN_HEIGHT);*/
    }
}

export default Renderer;
