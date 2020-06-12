export abstract class Node {
    abstract set value(v: number);
    abstract get value(): number;
    abstract get id(): string;
}

export abstract class AlphaBeta<T extends Node> {
    constructor(private maxHeight: number = Infinity) {}

    protected log: (...args: any) => void = () => {};
 
    /**
     * Returns an evaluation of a node between 0 and Infinity
     */
    protected abstract evaluation(node: T): number;

    /**
     * Check if the node corresponds to a leaf
     */
    protected abstract isLeaf(node: T): boolean;

    /**
     * Get the childs nodes of a given node
     */
    protected abstract getNexts(node: T): T[];

    /**
     * Classical alphabeta pruning algorithm that can be generalized to graph,
     * tree or everything that implement this class
     * 
     * @param node Head node of the tree
     * @param alpha Initialized to -Infinity
     * @param beta Initialized to Infinity
     * @param height Height Deep of the search
     */
    public run(node: T, max: boolean = true, alpha: number = Number.NEGATIVE_INFINITY,
        beta: number = Number.POSITIVE_INFINITY, height: number = 0): number {
        if (this.isLeaf(node) || height >= this.maxHeight) {
            return this.evaluation(node);
        }
        if (max) {
            node.value = Number.NEGATIVE_INFINITY;
            for (let child of this.getNexts(node)) {
                node.value = Math.max(node.value,
                    this.run(child, false, alpha, beta, height + 1));        
                if (node.value >= beta) {
                    this.log("max | cut", child.id, child.value);
                    return node.value;
                }
                alpha = Math.max(alpha, node.value);
            }
        } else {
            node.value = Number.POSITIVE_INFINITY;
            for (let child of this.getNexts(node)) {
                node.value = Math.min(node.value,
                    this.run(child, true, alpha, beta, height + 1));
                if (alpha >= node.value) {
                    this.log("min | cut", child.id, child.value);
                    return node.value;
                }
                beta = Math.min(beta, node.value);
            }
        }
        return node.value;
    }
}