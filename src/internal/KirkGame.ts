// Game singleton
import Matrix from "../tools/matrix";
import * as astar from "../tools/algos/astar";
import KirkIsSearching from "./kirkSearchingDest";

/**
 * Kirk game singleton
 */
export default class KirkGame {
    private _maze: Matrix | null = null; // the grid maze
    private _alarm: number = 0; // the alarm value
    private kirkPos: [number, number] = [-1, -1]; // current kirk position
    private static _instance: KirkGame | null = null; // the instance of the game
    private kirkIsSearching: KirkIsSearching | null = null; // Tool to peek the next destination

    private constructor() {
        if (KirkGame._instance != null) {
            throw Error('a unique instance of kirk game should be created ' +
            'in this case,, whattever you have to use "getGame"');
        } else {
            KirkGame._instance = this;
        }
    }

    public static getGame(): KirkGame {
        if (KirkGame._instance == null) {
            KirkGame._instance = new KirkGame();
        }
        return KirkGame._instance!;
    }

    public get alarm(): number {
        return this._alarm;
    }

    private get maze(): Matrix {
        return this._maze!; // impossible to have a null matrix here
    }

    private initMaze(width: number, height: number): void {
        this._maze = new Matrix(width, height);
    }

    private get(pos: [number, number]): string {
        if (this._maze != null) {
            return this.maze.get(pos[0], pos[1]);
        }
        return '';
    }

    public findPath(from: [number, number], to: [number, number], sure: boolean = false): [number, number][] {
        const node: astar.ANode = new astar.ANode(from[0], from[1]);
        return astar.process(node, to[0], to[1], (x: number, y: number) => {
            let res: astar.ANode[] = [];
            let invalid = ['', '#']; // todo peut être problématique
            if (sure) invalid.push('?');
            if (!invalid.includes(this.maze.get(x, y - 1)))
                res.push(new astar.ANode(x, y - 1));
            if (!invalid.includes(this.maze.get(x - 1, y)))
                res.push(new astar.ANode(x - 1, y));
            if (!invalid.includes(this.maze.get(x + 1, y)))
                res.push(new astar.ANode(x + 1, y));
            if (!invalid.includes(this.maze.get(x, y + 1)))
                res.push(new astar.ANode(x, y + 1));
            return res;
        });
    }

    /**
     * Setup the game with the first inputs.
     * 
     * Should be a line "HEIGHT WIDTH ALARM"
     * @param datas first input datas
     */
    public setupGame(datas: string): boolean {
        const constants = datas.split(' ');
        const height: number = parseInt(constants[0]); // number of rows.
        const width: number = parseInt(constants[1]); // number of columns.
        this.initMaze(width, height);
        this._alarm = parseInt(constants[2]);
        return true;
    }

    /**
     * Update grid
     * 
     * Should be a grid corresponding to the size of the maze/matrix
     */
    public updateGrid(datas: string, kirkPos: [number, number]) {
        if (this.kirkIsSearching == null) {
            this.kirkIsSearching = new KirkIsSearching(Object.assign([], kirkPos));
        }
        let lines: string[] = datas.split('\n');
        let line: string[] = lines.shift()!.split('');
        KirkGame.getGame().maze.init(() => {
            if (line.length == 0) {
                line = lines.shift()!.split('');
            }
            return line!.shift()!;
        });
        KirkGame.getGame().kirkPos = kirkPos;
    }

    private getDirection(path: [number, number][]): string {
        if (path.length >= 2) {
            let nextStep = path[path.length - 2];
            if (this.kirkPos[0] < nextStep[0]) {
                return "right";
            } else if (this.kirkPos[0] > nextStep[0]) {
                return "left";
            } else if (this.kirkPos[1] < nextStep[1]) {
                return "down";
            } else if (this.kirkPos[1] > nextStep[1]) {
                return "up";
            }
        }
        return "";
    }

    /**
     * Run a round of the game
     */
    public getNewDirection(): string {
        let destination: [number, number] = this.kirkIsSearching!.peekNewDestination(this.maze, this.kirkPos);
        let path = this.findPath(this.kirkPos, destination);
        if (path.length == 0 && this.get(destination) == 'C') {
            console.error("No path to the destination !!");
            return '';
        }
        return this.getDirection(path);
    }

    public getMazeHeight(): number {
        return this.maze.height;
    }
}