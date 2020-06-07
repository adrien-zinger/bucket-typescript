import Grid from "../src/tools/grid";

describe('Test matrix', () => {
  it('simple grid create and print', () => {
    let inputLines: string[] = "a b c\nd e f\ng h i".split('\n')!;
    let matrix: Grid<string> = new Grid(3, 3);
    let currentLine: string[] = inputLines.shift()!.split(' ')!;
    matrix.init(() => {
        if (currentLine.length==0) {
            currentLine = inputLines.shift()!.split(' ')!;
        }
        return currentLine.shift()!
    });
    let out = '';
    matrix.print((str: string) => {
        out += str + '\n';
    }, ' ');
    expect(out).toEqual("a b c\nd e f\ng h i\n");
  });

  it('simple grid check get and is in', () => {
    let matrix: Grid<string> = new Grid(3, 3, '');
    matrix.init(() => '.');
    expect(matrix.get(0, 0)).toEqual('.');
    expect(matrix.get(0, 2)).toEqual('.');
    expect(matrix.get(2, 0)).toEqual('.');
    expect(matrix.get(2, 2)).toEqual('.');
    expect(matrix.get(3, 2)).toEqual('');
    expect(matrix.get(0, 3)).toEqual('');
    expect(matrix.get(-1, 3)).toEqual('');
    expect(matrix.get(1, -1)).toEqual('');
  });
});