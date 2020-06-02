// Exercise with astar
import KirkGame from "./internal/KirkGame"; // x for eXercise
import { readline } from "./tools/readline";

function main(): number {
    let kirkGame: KirkGame = KirkGame.getGame();
    // First we setup the game with the first inputs
    kirkGame.setupGame(readline());
    while(true) {
        let kirkPos: string[] = readline().split(' ');
        let grid: string = '';
        for (let i = 0; i < kirkGame.getMazeHeight(); i++) {
            grid += readline() + '\n';
        }
        kirkGame.updateGrid(grid.substring(0, grid.length - 1), [parseInt(kirkPos[0]), parseInt(kirkPos[1])]);
        console.log(kirkGame.getNewDirection());
    }
}

console.log(main());