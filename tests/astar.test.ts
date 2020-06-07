import * as astar from "../src/tools/algos/astar";
import Grid from "../src/tools/grid";

/**
 * 
 * 
 * Return this
 * ....
 * ....
 * ....
 * ....
 */
function getSimpleMaze(): Grid<string> {
  let ret: Grid<string> = new Grid<string>(4, 4, '');
  ret.init(() => '.');
  return ret;
}

describe('Test astar algorithm', () => {
  it('simple astar four dimensionnal moves', () => {
    let maze: Grid<string> = getSimpleMaze();
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
    let maze: Grid<string> = getSimpleMaze();
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
    let maze: Grid<string> = getSimpleMaze();
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
    let maze: Grid<string> = getSimpleMaze();
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
    let maze: Grid<string> = getSimpleMaze();
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