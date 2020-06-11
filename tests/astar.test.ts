import {astar, Node} from "../src/tools/algos/astar";
import Grid from "../src/tools/grid";

function getSimpleMaze(): Grid<string> {
  let ret: Grid<string> = new Grid<string>(4, 4, '');
  ret.init(() => '.');
  return ret;
}

function PathHeuristic(from: [number, number], to: [number, number]): number {
  return Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]);
}

class GridNode extends Node<[number, number]> {
  readonly value: [number, number];
  constructor(x: number, y: number) {
    super();
    this.value = [x, y];
  }
  get cost(): number {
    return 1;
  }
  get id(): string {
    return this.value[0] + ' ' + this.value[1];
  }
}

function print(node: GridNode | null): string {
  let ret = "";
  while (node != null) {
    ret += `[${node.value[0]}, ${node.value[1]}] `
    node = node.parent;
  }
  return ret.substring(0, ret.length - 1);
}

describe('Test astar algorithm', () => {
  it('simple astar four dimensionnal moves', () => {
    const maze: Grid<string> = getSimpleMaze();
    const path = astar(new GridNode(0, 0), new GridNode(3, 3), (node: GridNode) => {
      let ret: GridNode[] = [];
      const x = node.value[0];
      const y = node.value[1];
      if (maze.get(x - 1, y) != '') ret.push(new GridNode(x - 1, y));
      if (maze.get(x + 1, y) != '') ret.push(new GridNode(x + 1, y));
      if (maze.get(x, y - 1) != '') ret.push(new GridNode(x, y - 1));
      if (maze.get(x, y + 1) != '') ret.push(new GridNode(x, y + 1));
      return ret;
    }, PathHeuristic);
    expect(print(path)).toEqual("[3, 3] [3, 2] [3, 1] [3, 0] [2, 0] [1, 0] [0, 0]");
  });


  it('simple astar eight dimensionnal moves', () => {
    const maze: Grid<string> = getSimpleMaze();
    const path = astar(new GridNode(0, 0), new GridNode(3, 3), (node: GridNode) => {
      let ret: GridNode[] = [];
      const x = node.value[0];
      const y = node.value[1];
      if (maze.get(x - 1, y - 1) != '') ret.push(new GridNode(x - 1, y - 1));
      if (maze.get(x    , y - 1) != '') ret.push(new GridNode(x    , y - 1));
      if (maze.get(x + 1, y - 1) != '') ret.push(new GridNode(x + 1, y - 1));
      if (maze.get(x - 1, y    ) != '') ret.push(new GridNode(x - 1, y    ));
      if (maze.get(x + 1, y    ) != '') ret.push(new GridNode(x + 1, y    ));
      if (maze.get(x - 1, y + 1) != '') ret.push(new GridNode(x - 1, y + 1));
      if (maze.get(x    , y + 1) != '') ret.push(new GridNode(x    , y + 1));
      if (maze.get(x + 1, y + 1) != '') ret.push(new GridNode(x + 1, y + 1));
      return ret;
    }, PathHeuristic);
    expect(print(path)).toEqual("[3, 3] [2, 2] [1, 1] [0, 0]");
  });

  it('simple astar four dimensionnal moves with barriers', () => {
    let maze: Grid<string> = getSimpleMaze();
    maze.set(1, 0, '#');
    maze.set(1, 1, '#');
    const path = astar(new GridNode(0, 0), new GridNode(3, 3), (node: GridNode) => {
      let ret: GridNode[] = [];
      const x = node.value[0];
      const y = node.value[1];
      if (maze.get(x - 1, y) != '' && maze.get(x - 1, y) != '#') ret.push(new GridNode(x - 1, y));
      if (maze.get(x + 1, y) != '' && maze.get(x + 1, y) != '#') ret.push(new GridNode(x + 1, y));
      if (maze.get(x, y - 1) != '' && maze.get(x, y - 1) != '#') ret.push(new GridNode(x, y - 1));
      if (maze.get(x, y + 1) != '' && maze.get(x, y + 1) != '#') ret.push(new GridNode(x, y + 1));
      return ret;
    }, PathHeuristic);
    expect(print(path)).toEqual("[3, 3] [3, 2] [2, 2] [1, 2] [0, 2] [0, 1] [0, 0]");
  });

  it('simple astar four dimensionnal moves with too much barriers', () => {
    let maze: Grid<string> = getSimpleMaze();
    maze.set(1, 0, '#');
    maze.set(1, 1, '#');
    maze.set(2, 2, '#');
    maze.set(2, 3, '#');
    const path = astar(new GridNode(0, 0), new GridNode(3, 3), (node: GridNode) => {
      let ret: GridNode[] = [];
      const x = node.value[0];
      const y = node.value[1];
      if (maze.get(x - 1, y) != '' && maze.get(x - 1, y) != '#') ret.push(new GridNode(x - 1, y));
      if (maze.get(x + 1, y) != '' && maze.get(x + 1, y) != '#') ret.push(new GridNode(x + 1, y));
      if (maze.get(x, y - 1) != '' && maze.get(x, y - 1) != '#') ret.push(new GridNode(x, y - 1));
      if (maze.get(x, y + 1) != '' && maze.get(x, y + 1) != '#') ret.push(new GridNode(x, y + 1));
      return ret;
    }, PathHeuristic);
    expect(path).toEqual(null);
  });

  it('simple astar four dimensionnal moves with barriers at the end point', () => {
    let maze: Grid<string> = getSimpleMaze();
    maze.set(3, 3, '#');
    const path = astar(new GridNode(0, 0), new GridNode(3, 3), (node: GridNode) => {
      let ret: GridNode[] = [];
      const x = node.value[0];
      const y = node.value[1];
      if (maze.get(x - 1, y) != '' && maze.get(x - 1, y) != '#') ret.push(new GridNode(x - 1, y));
      if (maze.get(x + 1, y) != '' && maze.get(x + 1, y) != '#') ret.push(new GridNode(x + 1, y));
      if (maze.get(x, y - 1) != '' && maze.get(x, y - 1) != '#') ret.push(new GridNode(x, y - 1));
      if (maze.get(x, y + 1) != '' && maze.get(x, y + 1) != '#') ret.push(new GridNode(x, y + 1));
      return ret;
    }, PathHeuristic);
    expect(path).toEqual(null);
  });
});