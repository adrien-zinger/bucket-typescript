import Random from "../random";
import PromisePool from "../promisesPool";

class Person<T> {
    constructor(public adn: T, public score: number = 0) {};
}

export abstract class GeneticProcessSync<T> {
    protected _generation: Person<T>[] = [];

    protected constructor (generation: T[],
        protected readonly MAX_POPULATION: number,
        populate: boolean = true) {
        for (const g of generation)
            if (this._generation.length < this.MAX_POPULATION)
                this._generation.push(new Person(g));
            else break;
        if (populate)
            this.populate();
    }

    protected abstract reproduction(a: T, b: T): T;
    protected abstract mutation(): T;
    protected abstract score(adn: T): number;

    public run() {
        for (let person of this._generation)
            person.score = this.score(person.adn);
        this._generation = this._generation.sort((a, b) => a.score - b.score).slice(0, this.MAX_POPULATION / 2);
        this.populate();
    }

    private populate() {
        while (this._generation.length < this.MAX_POPULATION)
            if (Math.random() < 0.05)
                this._generation.push(new Person(this.mutation()));
            else
                this._generation.push(new Person(this.reproduction(
                    this._generation[Random.range(0, this._generation.length - 1)].adn,
                    this._generation[Random.range(0, this._generation.length - 1)].adn)));
    }
}

export abstract class GeneticProcessASync<T> extends GeneticProcessSync<T> {
    protected constructor (generation: T[],
        protected readonly MAX_POPULATION: number) {
        super(generation, MAX_POPULATION, false);
        this.apopulate();
    }

    protected abstract reproduction(a: T, b: T): T;
    protected abstract mutation(): T;
    protected abstract score(adn: T): number;

    public async arun() {
        let promisePool: PromisePool<number> = new PromisePool<number>(12);
        let scores: Promise<number>[] = [];
        for (let person of this._generation)
            scores.push(promisePool.push(this.score, person.adn));
        await Promise.all(scores).then((scores: number[]) => {
            for (let i = 0; i < scores.length; ++i)
                this._generation[i].score = scores[i];
            this._generation = this._generation
            .sort((a, b) => a.score - b.score)
            .slice(0, this.MAX_POPULATION / 2)
        });
        this.apopulate();
    }

    private async apopulate() {
        let promisePool: PromisePool<T> = new PromisePool<T>(12);
        let newpeople: Promise<T>[] = []; 
        for (let i = 0; i < this.MAX_POPULATION / 2; ++i) {
            if (Math.random() < 0.05) newpeople.push(promisePool.push(this.mutation));
            else newpeople.push(promisePool.push(this.reproduction,
                this._generation[Random.range(0, this._generation.length - 1)].adn,
                this._generation[Random.range(0, this._generation.length - 1)].adn));
        }
        await Promise.all(newpeople).then((adns: T[]) => {
            for (const adn of adns)
                this._generation.push(new Person(adn));
        });
    }
}