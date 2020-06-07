import Grid from "../tools/grid"
import KirkGame from "./KirkGame"

/**
 * I made this class because kirk need to find a new destination when he found
 * the previous destination. But this research can be diffeerent depending of
 * the events
 */

enum State {
    searchingTheCommandRoom,
    commandRoomFoundButTooLong,
    commandRoomFoundReadyTooGo,
    returningToTheTeleporter
}

function random(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class KirkIsSearching {
    // Positions in the game
    private _commandRoom: [number, number] | null = null;

    // History of position peeked format "x y"
    private history: string[] = [];

    private _state: State = State.searchingTheCommandRoom;

    constructor(private readonly teleporter: [number, number]) {};

    private getCurrentDestination(): [number, number] | null {
        if (this.history.length > 0) {
            const currentPos: string[] = this.history[this.history.length - 1].split(' ');
            return [parseInt(currentPos[0]), parseInt(currentPos[1])];
        }
        return null;
    }

    private isCurrentDestinationValid(maze: Grid<string>, kirkPos: [number, number]): boolean {
        const game: KirkGame = KirkGame.getGame();
        const currentDest = this.getCurrentDestination();
        return currentDest != null
        && maze.get(currentDest[0], currentDest[1]) == '?'
        && game.findPath(kirkPos, currentDest).length > 0;
    }

    private peekDestination_CommandRoomFoundReadyToGo(kirkPos: [number, number]): [number, number] {
        if (kirkPos[0] == this._commandRoom![0] && kirkPos[1] == this._commandRoom![1]) {
            this._state = State.returningToTheTeleporter;
            return this.teleporter;
        }
        return this._commandRoom!;
    }

    private peekDestination_CommandRoomFoundButTooLong(maze: Grid<string>, kirkPos: [number, number]): [number, number] {
        console.log("peekDestination_CommandRoomFoundButTooLong")
        const game: KirkGame = KirkGame.getGame();
        if (this.isCurrentDestinationValid(maze, kirkPos))
            return this.getCurrentDestination()!;
        const pathCheck: [number, number][] = game.findPath(
                this._commandRoom!, this.teleporter, true);
        if (pathCheck.length != 0 && pathCheck.length <= game.alarm) {
            this._state = State.commandRoomFoundReadyTooGo;
            return this.peekDestination_CommandRoomFoundReadyToGo(kirkPos);
        }
        const path: [number, number][] = game.findPath(
            this._commandRoom!, this.teleporter);
        const rets: [number, number][] = path.filter(
            (pos: [number, number]) => {
                return maze.get(pos[0], pos[1]) == '?';
            });
        if (rets.length == 0) {
            console.error("Should'nt exist case... because"
                + " the shortest path is too long");
        }
        const ret = rets[random(0, rets.length - 1)];
        this.history.push(ret[0] + " " +ret[1]);
        console.log("peek ", ret);
        return ret;
    }

    private onCommandRoomFound(maze: Grid<string>, kirkPos: [number, number]): [number, number] {
        const game: KirkGame = KirkGame.getGame();
        const path: [number, number][] = game.findPath(
            this._commandRoom!, this.teleporter, true); // search a path with no unknown destinations
            console.log("on command found")
        if (path.length == 0 || path.length > game.alarm) {
            this._state = State.commandRoomFoundButTooLong;
            this.history = [];
            return this.peekDestination_CommandRoomFoundButTooLong(maze, kirkPos);
        }
        this._state = State.commandRoomFoundReadyTooGo;
        return this.peekDestination_CommandRoomFoundReadyToGo(kirkPos);
    }

    private lookForTheCommandRoom(maze: Grid<string>, kirkPos: [number, number]): boolean {
        for (let x = kirkPos[0] - 2; x <= kirkPos[1] + 2; ++x)
            for (let y = kirkPos[1] - 2; y <= kirkPos[1] + 2; ++y) {
                //console.log("check " + x + " " + y + ":" + maze.get(x, y));
                if (maze.get(x, y) == 'C') {
                    this._commandRoom = [x, y];
                    return true;
                }
            }
        return false;
    }

    /**
     * Returns a random unexplored destination while the command room position
     * is unknown.
     * @param maze maze
     * @param kirkPos position of kirk
     */
    private peekDestination_SearchingTheCommandRoom(maze: Grid<string>, kirkPos: [number, number]): [number, number] {
        console.log("searching command room")
        if (this.lookForTheCommandRoom(maze, kirkPos)) {
            //console.log("command found");
            return this.onCommandRoomFound(maze, kirkPos);
        }
        if (this.isCurrentDestinationValid(maze, kirkPos)) {
            //console.log("return current")
            return this.getCurrentDestination()!;
        }
        let ret: [number, number] = [ random(0, maze.width - 1),
            random(0, maze.height - 1) ];
        const invalid = ['.', '#', 'T']; // specific to the current problem
        while (maze.get(ret[0], ret[1]) != undefined
        && invalid.includes(maze.get(ret[0], ret[1])!)
        || this.history.includes(ret[0] + ' ' + ret[1])) {
            ret = [random(0, maze.width - 1), random(0, maze.height - 1)];
        }
        this.history.push(ret[0] + ' ' + ret[1]);
        return ret;
    }

    // Public access to the research
    /**
     * Get the next destination to kirk
     */
    public peekNewDestination(maze: Grid<string>, kirkPos: [number, number]): [number, number] {
        console.log("state", State[this._state]);
        switch(this._state) {
            case State.searchingTheCommandRoom:
                return this.peekDestination_SearchingTheCommandRoom(maze, kirkPos);
            case State.commandRoomFoundButTooLong:
                return this.peekDestination_CommandRoomFoundButTooLong(maze, kirkPos);
            case State.commandRoomFoundReadyTooGo:
                return this.peekDestination_CommandRoomFoundReadyToGo(kirkPos);
            case State.returningToTheTeleporter: {
                console.log(this.teleporter);
                return this.teleporter!
            }
        }
    }

}