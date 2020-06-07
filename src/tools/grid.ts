// Two dimansionnal array are really often used in algoritms so I wanted one


/**
 * Return one dimension index of x, y
 * @param x absciss
 * @param y ordinate
 * @param gridwidth width of the grid 
 */
export function getIndex(x:number, y:number, gridwidth:number): number {
    return x + (y * gridwidth);
}

export function getPos(index: number, gridwidth: number): [number, number] {
    return [index % gridwidth, Math.floor(index / gridwidth)];
}

export default class Grid<T extends string | number> {
    private datas: Map<number, T> = new Map(); // the current matrix container
    
    constructor(
        public readonly width: number, // the current matrix width
        public readonly height: number, // the current matrix height
        public readonly defaultValue: T | undefined = undefined // default value to return if get[x, y] not possible
        ) {
        if (width <= 0 || height <= 0) throw new Error("Invalid negative width or height");
    }

    /**
     * For each value of the matrix set 
     */
    public init(func: (x: number, y: number) => T) {
        for (let y = 0; y < this.height; ++y)
            for (let x = 0; x < this.width; ++x)
                this.datas.set(getIndex(x, y, this.width), func(x, y));
    }

    /**
     * For each value of the matrix 
    */
    public foreach(func: (x: number, y: number, value: T | undefined) => void) {
        for (let y = 0; y < this.height; ++y)
            for (let x = 0; x < this.width; ++x)
                func(x, y, this.get(x, y));
    }

    /**
     * For each value of the matrix, should return true or nothing or the loop will break 
     */
    public some(func: (x: number, y: number, value: T | undefined) => boolean) {
        for (let y = 0; y < this.height; ++y)
            for (let x = 0; x < this.width; ++x)
                if(!func(x, y, this.get(x, y))) return;
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
    public get(x: number, y: number): T | undefined {
        if (this.isIn(x, y)) {
            const ret = this.datas.get(getIndex(x, y, this.width));
            if (ret != undefined) return ret;
        }
        return this.defaultValue;
    }

    public set(x: number, y: number, value: T): boolean {
        if (this.isIn(x, y)) {
            this.datas.set(getIndex(x, y, this.width), value);
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
            if (line == '')
                line += this.get(x, y);
            else
                line += separator + this.get(x, y);
        });
        printer(line);
    }

    public get truesize(): number {
        return this.datas.size;
    }

    public get size(): number {
        return this.width * this.height;
    }
}
