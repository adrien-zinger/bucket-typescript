export default class PromisePool<T> {
    private pendingPromises: Set<Promise<T>> = new Set();
    constructor(private readonly MAX_PROMISES: number) {};

    private async createPromess(task:(...args: any[]) => T, ...args: any[]) {
        return task.apply(args[0], args);
    }

    public async push(task:(...args: any[]) => T, ...args: any[]): Promise<T> {
        while (this.pendingPromises.size >= this.MAX_PROMISES)
            await Promise.race(this.pendingPromises).catch(() => {});
        const p = this.createPromess(task, args);
        this.pendingPromises.add(p);
        await p.catch(() => {});
        this.pendingPromises.delete(p);
        return p;
    }

    public async await() {
        while(this.pendingPromises.size > 0) {
            await Promise.race(this.pendingPromises).catch(() => {});
        }
    }
}