// Exercise with astar
import KirkGame from "./internal/KirkGame"; // x for eXercise
import * as rl from "./tools/readline";


async function main() {
    let kirkGame: KirkGame = KirkGame.getGame();
    // First we setup the game with the first inputs
    let line: string = '';
    await rl.readline().then(str => line = str);
    kirkGame.setupGame(line);
    while(true) {
        await rl.readline().then(str => line = str);
        let kirkPos: string[] = line.split(' ');
        let grid: string = '';
        for (let i = 0; i < kirkGame.getMazeHeight(); i++) {
            await rl.readline().then(str => line = str);
            grid += line + '\n';
        }
        kirkGame.updateGrid(grid.substring(0, grid.length - 1), [parseInt(kirkPos[0]), parseInt(kirkPos[1])]);
        console.log(kirkGame.getNewDirection());
    }
}

main();