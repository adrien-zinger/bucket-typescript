import * as astar from "../src/tools/algos/astar";
import Matrix from "../src/tools/matrix";

/**
 * 
 * 
 * Return this
 * ....
 * ....
 * ....
 * ....
 */
function getSimpleMaze(): Matrix {
  let ret: Matrix = new Matrix(4, 4);
  ret.init(() => '.');
  return ret;
}


function printMaze(maze: Matrix) {
  let line = '';
  maze.print((str: string) => line += str + '\n')
  console.log(line);
}

describe('Test astar algorithm', () => {
  it('simple astar four dimensionnal moves', () => {
    let maze: Matrix = getSimpleMaze();
    let from: astar.ANode = new astar.ANode(0, 0);
    let path: [number, number][] = astar.process(from, 3, 3, (x: number, y: number) => {
      let ret: astar.ANode[] = [];
      if (maze.get(x - 1, y) != '') ret.push(new astar.ANode(x - 1, y));
      if (maze.get(x + 1, y) != '') ret.push(new astar.ANode(x + 1, y));
      if (maze.get(x, y - 1) != '') ret.push(new astar.ANode(x, y - 1));
      if (maze.get(x, y + 1) != '') ret.push(new astar.ANode(x, y + 1));
      return ret;
    });
    expect(path).toEqual([
      [ 3, 3 ], [ 3, 2 ],
      [ 3, 1 ], [ 3, 0 ],
      [ 2, 0 ], [ 1, 0 ],
      [ 0, 0 ]
    ]);
  });


  it('simple astar eight dimensionnal moves', () => {
    let maze: Matrix = getSimpleMaze();
    let from: astar.ANode = new astar.ANode(0, 0);
    let path: [number, number][] = astar.process(from, 3, 3, (x: number, y: number) => {
      let ret: astar.ANode[] = [];
      if (maze.get(x - 1, y - 1) != '') ret.push(new astar.ANode(x - 1, y - 1));
      if (maze.get(x    , y - 1) != '') ret.push(new astar.ANode(x    , y - 1));
      if (maze.get(x + 1, y - 1) != '') ret.push(new astar.ANode(x + 1, y - 1));
      if (maze.get(x - 1, y    ) != '') ret.push(new astar.ANode(x - 1, y    ));
      if (maze.get(x + 1, y    ) != '') ret.push(new astar.ANode(x + 1, y    ));
      if (maze.get(x - 1, y + 1) != '') ret.push(new astar.ANode(x - 1, y + 1));
      if (maze.get(x    , y + 1) != '') ret.push(new astar.ANode(x    , y + 1));
      if (maze.get(x + 1, y + 1) != '') ret.push(new astar.ANode(x + 1, y + 1));
      return ret;
    });
    expect(path).toEqual([ [ 3, 3 ], [ 2, 2 ], [ 1, 1 ], [ 0, 0 ] ]);
  });

  it('simple astar four dimensionnal moves with barriers', () => {
    let maze: Matrix = getSimpleMaze();
    maze.set(1, 0, '#');
    maze.set(1, 1, '#');
    let from: astar.ANode = new astar.ANode(0, 0);
    let path: [number, number][] = astar.process(from, 3, 3, (x: number, y: number) => {
      let ret: astar.ANode[] = [];
      if (maze.get(x - 1, y) != '' && maze.get(x - 1, y) != '#') ret.push(new astar.ANode(x - 1, y));
      if (maze.get(x + 1, y) != '' && maze.get(x + 1, y) != '#') ret.push(new astar.ANode(x + 1, y));
      if (maze.get(x, y - 1) != '' && maze.get(x, y - 1) != '#') ret.push(new astar.ANode(x, y - 1));
      if (maze.get(x, y + 1) != '' && maze.get(x, y + 1) != '#') ret.push(new astar.ANode(x, y + 1));
      return ret;
    });
    expect(path).toEqual([
      [ 3, 3 ], [ 3, 2 ],
      [ 2, 2 ], [ 1, 2 ],
      [ 0, 2 ], [ 0, 1 ],
      [ 0, 0 ]
    ]);
  });

  it('simple astar four dimensionnal moves with too much barriers', () => {
    let maze: Matrix = getSimpleMaze();
    maze.set(1, 0, '#');
    maze.set(1, 1, '#');
    maze.set(2, 2, '#');
    maze.set(2, 3, '#');
    let from: astar.ANode = new astar.ANode(0, 0);
    let path: [number, number][] = astar.process(from, 3, 3, (x: number, y: number) => {
      let ret: astar.ANode[] = [];
      if (maze.get(x - 1, y) != '' && maze.get(x - 1, y) != '#') ret.push(new astar.ANode(x - 1, y));
      if (maze.get(x + 1, y) != '' && maze.get(x + 1, y) != '#') ret.push(new astar.ANode(x + 1, y));
      if (maze.get(x, y - 1) != '' && maze.get(x, y - 1) != '#') ret.push(new astar.ANode(x, y - 1));
      if (maze.get(x, y + 1) != '' && maze.get(x, y + 1) != '#') ret.push(new astar.ANode(x, y + 1));
      return ret;
    });
    expect(path).toEqual([]);
  });

  it('simple astar four dimensionnal moves with barriers at the end point', () => {
    let maze: Matrix = getSimpleMaze();
    maze.set(3, 3, '#');
    let from: astar.ANode = new astar.ANode(0, 0);
    let path: [number, number][] = astar.process(from, 3, 3, (x: number, y: number) => {
      let ret: astar.ANode[] = [];
      if (maze.get(x - 1, y) != '' && maze.get(x - 1, y) != '#') ret.push(new astar.ANode(x - 1, y));
      if (maze.get(x + 1, y) != '' && maze.get(x + 1, y) != '#') ret.push(new astar.ANode(x + 1, y));
      if (maze.get(x, y - 1) != '' && maze.get(x, y - 1) != '#') ret.push(new astar.ANode(x, y - 1));
      if (maze.get(x, y + 1) != '' && maze.get(x, y + 1) != '#') ret.push(new astar.ANode(x, y + 1));
      return ret;
    });
    expect(path).toEqual([]);
  });
});