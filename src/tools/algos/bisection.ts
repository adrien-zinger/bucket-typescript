export class BisectionApproach {
    private sign: number;
    private subrange: number[] = [];
    private index: number;
    public result: number | undefined = undefined;
    private lastTry: number | undefined = undefined;

    constructor(public closer: ((index: number) => number | undefined),
                private readonly range = [-Infinity, Infinity],
                private readonly initialIndex: number = 0,
                private offset: number = 0) {
        if (this.range[0] >= this.range[1])
            throw new Error("Invalid range");
        if ((this.range[0] == -Infinity || this.range[1] == Infinity) && this.offset == 0)
            throw new Error("Offset has to be > 0 when range is infinity");
        if (this.initialIndex == -Infinity || this.initialIndex == Infinity)
            throw new Error("Initial index cannot be infinity");
        if (this.range[1] - this.initialIndex > this.initialIndex) this.sign = 1;
        else this.sign = -1;
        if (this.offset == 0 && this.range[0] != -Infinity && this.range[1] != Infinity)
            if (this.sign == 1) this.offset = (this.range[1] - this.initialIndex) / 2;
            else this.offset = (this.range[0] + this.initialIndex) / 2;
        this.offset = Math.round(this.offset);
        this.subrange = Object.assign([], this.range);
        this.index = this.initialIndex;
    }

    private success(index: number): boolean {
        if (this.lastTry == undefined) this.result = index;
        else this.result = Math.floor((this.lastTry + index) / 2);
        this.index = this.result;
        this.offset = 0;
        return false;
    }

    public run(): boolean {
        const i = this.index + this.sign * this.offset;
        const res = this.closer(i);
        if (res == undefined)
            return this.success(i);
        if (res > 0) {
            if (this.sign == 1) {
                this.subrange[0] = Math.floor((this.index + i) / 2);
                if (this.subrange[1] != Infinity)
                    this.offset = Math.round((this.subrange[1] - i) / 2);
            } else {
                this.subrange[1] = Math.round((this.index + i) / 2);
                if (this.subrange[0] != -Infinity)
                    this.offset = Math.round((i - this.subrange[0]) / 2);
            }
            this.index = i;
        } else if (res < 0) {
            if (this.sign == 1) {
                this.subrange[1] = Math.round((this.index + i) / 2);
                if (this.subrange[0] != -Infinity)
                    this.offset = Math.round((this.subrange[1] - this.subrange[0]) / 2);
                this.index = this.subrange[1];
            } else {
                this.subrange[0] = Math.floor((this.index + i) / 2);
                if (this.subrange[0] != -Infinity)
                    this.offset = Math.round((this.subrange[1] - this.subrange[0]) / 2);
                this.index = this.subrange[0];
            }
            this.sign *= -1;
        } else if (this.result == undefined)
            return this.success(i);
        this.lastTry = i;
        if (this.offset == 0) return this.success(i);
        return this.result == undefined;
    }
}
