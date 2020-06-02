import KirkGame from "../src/internal/KirkGame";
import Matrix from "../src/tools/matrix";
import * as astar from "../src/tools/algos/astar";

class MazeTest extends Matrix {
    private final: string =
    "##########" + '\n' +
    "#.....T###" + '\n' +
    "#.########" + '\n' +
    "#.#C.....#" + '\n' +
    "#.#####..#" + '\n' +
    "#.#......#" + '\n' +
    "#.#.######" + '\n' +
    "#.#...####" + '\n' +
    "#.....####" + '\n' +
    "##########";
    
    public revealedPos: [number, number][] = [];
    public kirkPos: [number, number] = [6, 1];
    public finalPos: [number, number] = [3, 3];

    constructor() {
        super(10, 10);
        let lines: string[] = this.final.split('\n');
        let line: string[] = lines.shift()!.split('');
        this.init(() => {
            if (line.length == 0) {
                line = lines.shift()!.split('');
            }
            return line!.shift()!;
        });
        this.reveal();
    }

    private reveal() {
        for (let x = this.kirkPos[0] - 2; x <= this.kirkPos[0] + 2; ++x) {
            for (let y = this.kirkPos[1] - 2; y <= this.kirkPos[1] + 2; ++y) {
                if (this.isIn(x, y) && !this.revelated(x, y)) {
                    this.revealedPos.push([x, y])
                }
            }
        }
    }

    public up(): boolean {
        this.kirkPos[1]--;
        this.reveal();
        return ['#', '?', ''].includes(this.get(this.kirkPos[0], this.kirkPos[1]));
    }

    public down(): boolean {
        this.kirkPos[1]++;
        this.reveal();
        return ['#', '?', ''].includes(this.get(this.kirkPos[0], this.kirkPos[1]));
    }

    public left(): boolean {
        this.kirkPos[0]--;
        this.reveal();
        return ['#', '?', ''].includes(this.get(this.kirkPos[0], this.kirkPos[1]));
    }

    public right(): boolean {
        this.kirkPos[0]++;
        this.reveal();
        return ['#', '?', ''].includes(this.get(this.kirkPos[0], this.kirkPos[1]));
    }

    private revelated(x: number, y: number): boolean {
        for (let pos of this.revealedPos) {
            if (pos[0] == x && pos[1] == y) {
                return true;
            }
        }
        return false;
    }

    public getGrid(): string {
        let ret: string = '';
        let curY: number = 0;
        this.foreach((x, y) => {
            if (y != curY) {
                curY = y;
                ret += '\n';
            }
            if (this.revelated(x, y)) {
                ret += this.get(x, y);
            }
            else ret += '?';
        });
        return ret;
    }

    public debug() {
        let ret: string = '';
        let curY: number = 0;
        this.foreach((x, y) => {
            if (y != curY) {
                curY = y;
                ret += '\n';
            }
            if (x == this.kirkPos[0] && y == this.kirkPos[1]) {
                ret += 'k';
            } else if (this.revelated(x, y)) {
                ret += this.get(x, y);
            }
            else ret += '?';
        });
        console.log(ret);
    }
}

function diff(a: [number, number], b: [number, number]) : boolean {
    return !(a[0] == b[0] && a[1] == b[1]);
}

describe('Test captain kirk game', () => {
    it('simple game', () => {
        let maze = new MazeTest();
        let game = KirkGame.getGame();
        game.setupGame("10 10 100");
        for (let i = 0; i < 55; ++i) {
            //maze.debug();
            game.updateGrid(maze.getGrid(), maze.kirkPos);
            const pos = game.getNewDirection();
            switch(pos) {
                case 'right': maze.right(); break;
                case 'left': maze.left(); break;
                case 'up': maze.up(); break;
                case 'down': maze.down(); break;
                default: {
                    console.log("Unknown...");
                    expect(true).toEqual(false);
                }
            }
        }
    });

    it('astar for kirk', () => {
        let maze = new MazeTest();
        maze.left();
        let kirk: astar.ANode = new astar.ANode(5,1);
        let path = astar.process(kirk, 3, 3, (x: number, y: number) => {
            let res: astar.ANode[] = [];
            const tst = ['', '#'];
            if (!tst.includes(maze.get(x, y - 1)))
                res.push(new astar.ANode(x, y - 1));
            if (!tst.includes(maze.get(x - 1, y)))
                res.push(new astar.ANode(x - 1, y));
            if (!tst.includes(maze.get(x + 1, y)))
                res.push(new astar.ANode(x + 1, y));
            if (!tst.includes(maze.get(x, y + 1)))
                res.push(new astar.ANode(x, y + 1));
            return res;
        });
        expect(path.length).not.toEqual(0)
    });
});