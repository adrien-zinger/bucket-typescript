// Two dimansionnal array are really often used in algoritms so I wanted one

export default class Matrix {
    private matrix: string[][]; // the current matrix container
    
    constructor(
        public readonly width: number, // the current matrix width
        public readonly height: number // the current matrix height
        ) {
        this.matrix = [];
        for (let i = 0; i < this.height; ++i) {
            this.matrix[i] = [];
            for (let j = 0; j < this.width; ++j) {
                this.matrix[i].push("");
            }
        }
    }

    /**
     * For each value of the matrix set 
    */
    public init(func: (x: number, y: number) => string) {
        for (let y = 0; y < this.height; ++y)
            for (let x = 0; x < this.width; ++x)
                this.matrix[y][x] = func(x, y);
    }

    /**
     * For each value of the matrix 
    */
    public foreach(func: (x: number, y: number, value: string) => void) {
        for (let y = 0; y < this.height; ++y)
            for (let x = 0; x < this.width; ++x)
                func(x, y, this.matrix[y][x]);
    }

    /**
     * For each value of the matrix, should return true or nothing or the loop will break 
    */
    public some(func: (x: number, y: number, value: string) => boolean) {
        for (let y = 0; y < this.height; ++y)
            for (let x = 0; x < this.width; ++x)
                if(!func(x, y, this.matrix[y][x])) return;
    }

    public isIn(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    /**
     * Return the value in the matrix in position (x, y).
     * Return empty string if does'nt exist;
     * @param x position x
     * @param y position y
     */
    public get(x: number, y: number): string {
        if (this.isIn(x, y)) {
            return this.matrix[y][x];
        }
        return '';
    }

    public set(x: number, y: number, value: string): boolean {
        if (this.isIn(x, y)) {
            this.matrix[y][x] = value;
            return true;
        }
        return false;
    }

    public print(printer: (str: string) => void = console.log, separator: string = '') {
        let currentLine: number = 0;
        let line = '';
        this.foreach((x: number, y: number) => {
            if (y != currentLine) {
                printer(line);
                line = '';
                currentLine = y;
            }
            if (line == '') {
                line += this.matrix[y][x];
            } else {
                line += separator + this.matrix[y][x];
            }
        });
        printer(line);
    }
}
