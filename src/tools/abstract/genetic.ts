import Random from "../random";
import PromisePool from "../promisesPool";
/***
 * Generic implemenntation of a genetic solution. 
 * 
 * 
 */

/**
 * Person of a population that has a score and an adn
 */
class Person<T> {
    constructor(public adn: T, public score: number = 0) {};
}

/**
 * Synchronous genetic abstract class with T as a adn representation
 */
export abstract class GeneticProcessSync<T> {
    protected _generation: Person<T>[] = [];

    /**
     * Create a population ready to get processed
     * 
     * @param generation Generation in the first round of genetic process
     * @param MAX_POPULATION Max number of person in a generation
     * @param populate Populate the generation in the constructor in order
     *                 to get generation.length = MAX_POPULATION, default true,
     *                 /!\ this is important to populate the generation before the first run.
     */
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

    /**
     * Implements the process of merge between two adn
     * @param a First adn
     * @param b Second adn
     * @returns Returns a new adn
     */
    protected abstract reproduction(a: T, b: T): T;

    /**
     * Implements the  mutation principe in a genetic algorithm
     * @returns A different adn to add in a generation
     */
    protected abstract mutation(): T;

    /**
     * Compute the score of an adn
     * @param adn adn of a person in the generation
     * @returns should return a score value. Note that more the score is high
     *          and more the person has a chance to be selected 
     */
    protected abstract score(adn: T): number;

    /**
     * Runs a cycle of selection
     */
    protected run() {
        this._generation = this._generation.slice(0, this.MAX_POPULATION / 2);
        this.populate();
    }

    protected populate() {
        while (this._generation.length < this.MAX_POPULATION)
            if (Math.random() < 0.05)
                this._generation.push(new Person(this.mutation()));
            else
                this._generation.push(new Person(this.reproduction(
                    Object.assign([], this._generation[Random.range(0, this._generation.length - 1)].adn),
                    Object.assign([], this._generation[Random.range(0, this._generation.length - 1)].adn))));
        for (let person of this._generation)
            if (person.score == 0)
                person.score = this.score(person.adn);
        this._generation.sort((a, b) => b.score - a.score)
    }
}


/**
 * Asynchronous variant of the genetic abstract class
 * 
 * All score are called in a different thread (with a limit of 12 threads)
 * as the mutation and the reproduction methods.
 * 
 * As the populate function is asynchronous you need to populate the generation
 * after creating the object.
 * 
 * You need to call arun and apopulate instead of run and populate to get the difference.
 */
export abstract class GeneticProcessASync<T> extends GeneticProcessSync<T> {
    protected constructor (generation: T[],
        protected readonly MAX_POPULATION: number) {
        super(generation, MAX_POPULATION, false);
    }

    protected abstract reproduction(a: T, b: T): T;
    protected abstract mutation(): T;
    protected abstract score(adn: T): number;

    // Asynch pool adapter method for mutation
    private applyMutation(args: any[]) {
        return (args[0] as GeneticProcessASync<T>).mutation();
    }

    // Asynch pool adapter method for reproduction
    private applyReproduction(args: any[]) {
        return (args[0] as GeneticProcessASync<T>).reproduction(args[1], args[2]);
    }

    // Asynch pool adapter method for score
    private applyScore(args: any[]) {
        return (args[0] as GeneticProcessASync<T>).score(args[1]);
    }

    protected async arun() {
        this._generation = this._generation.slice(0, this.MAX_POPULATION / 2);
        await this.apopulate();
    }

    /**
     * TODO shuffle insted of random..
     */
    protected async apopulate() {
        if (this._generation.length == this.MAX_POPULATION)
            return;
        let promisePool: PromisePool<T> = new PromisePool<T>(12);
        let newpeople: Promise<T>[] = [];
        const L = this._generation.length;
        for (let i = 0; i < this.MAX_POPULATION - L; ++i) {
            if (Math.random() < 0.05) newpeople.push(promisePool.push(this.applyMutation, this));
            else newpeople.push(promisePool.push(this.applyReproduction, this,
                Object.assign([], this._generation[Random.range(0, this._generation.length - 1)].adn),
                Object.assign([], this._generation[Random.range(0, this._generation.length - 1)].adn)));
        }
        await promisePool.await();
        await Promise.all(newpeople).then((adns: T[]) => {
            for (const adn of adns)
                this._generation.push(new Person(adn));
        });
        await this.setScores();
    }

    private async setScores() {
        let promisePool: PromisePool<number> = new PromisePool<number>(12);
        let scores: Promise<number>[] = [];
        for (let person of this._generation)
            scores.push(promisePool.push(this.applyScore, this, person.adn));
        await promisePool.await();
        await Promise.all(scores).then((scores: number[]) => {
            for (let i = 0; i < scores.length; ++i)
                this._generation[i].score = scores[i];
        });
        this._generation.sort((a, b) => b.score - a.score);
    }
}