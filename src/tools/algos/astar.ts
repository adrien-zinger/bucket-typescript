/**
 * A lot of problems need a path finder, here I provvide my one version of the a* algorithm
 * 
 */
/*
Heuristics used:

geometric heuristic 
function PathHeuristic(x1: number, y1: number, x2: number, y2: number): number {
    var d1 = Math.abs (x2 - x1);
    var d2 = Math.abs (y2 - y1);
    return d1 + d2;
}
*/

function containNode<T>(list: Node<T>[], node: Node<T>): boolean {
    for (let el of list)
        if (el.id == node.id)
            return true;
    return false;
}

export abstract class Node<T> {
    f: number = 0; // Final score
    g: number = 0; // Distance score
    h: number = 0; // heuristic score
    parent: Node<T> | null = null;
    abstract readonly value: T;
    abstract get cost(): number
    abstract get id(): string;
}

/**
 * Classical astar

Usage. You need to create the first node ANode (for Astar Node)
       You need to implement the function getPathChilds that return a list of ANode
       Of course getPathChilds return the possible neighbours of the position x, y
       example:
       function pathChilds(x: number, y: number): ANode[] {
            let res: ANode[] = [];
            if (isIN(x - 1, y - 1) && GRID[y - 1][x - 1] != "#")
                res.push(new ANode(x - 1, y - 1));
            if (isIN(x, y - 1) && GRID[y - 1][x] != "#")
                res.push(new ANode(x, y - 1));
            if (isIN(x + 1, y - 1) && GRID[y - 1][x + 1] != "#")
                res.push(new ANode(x + 1, y - 1));
            if (isIN(x - 1, y) && GRID[y][x - 1] != "#")
                res.push(new ANode(x - 1, y));
            if (isIN(x, y) && GRID[y][x] != "#")
                res.push(new ANode(x, y));
            if (isIN(x + 1, y) && GRID[y][x + 1] != "#")
                res.push(new ANode(x + 1, y));
            if (isIN(x - 1, y + 1) && GRID[y + 1][x - 1] != "#")
                res.push(new ANode(x - 1, y + 1));
            if (isIN(x, y + 1) && GRID[y + 1][x] != "#")
                res.push(new ANode(x, y + 1));
            if (isIN(x + 1, y + 1) && GRID[y + 1][x + 1] != "#")
                res.push(new ANode(x + 1, y + 1));
            return res;
        }
    
 
Then call astar(node, posx end, posy end)
It return an empty list if its not possible
otherwise a list of positions from the head node to the final position
 * 
 * 
 * 
 * @param head The node corresponding to the initial position in the graph
 * @param endx The destination x position
 * @param endy The destination y position
 * @param getChilds function returning the next childs in the graph from x, y
 * 
 * @returns the target node with the parents path if a path has been fund, null otherwise
 */
export function astar<T>(head: Node<T>, target: Node<T>,
                            getChilds: (node: Node<T>) => Node<T>[],
                            heuristic: (node: T, target: T) => number): Node<T> | null {
    let openList: Array<Node<T>> = [head];
    let closed: Set<string> = new Set();
    while(openList.length > 0) {
        openList.sort((a: Node<T>, b: Node<T>) => a.f - b.f);
        let currentNode: Node<T> = openList.shift()!;
        closed.add(currentNode.id);
        let childs = getChilds(currentNode);
        for(let i: number = 0; i < childs.length; ++i) {
            if(closed.has(childs[i].id)) continue;
            childs[i].parent = currentNode;
            if (childs[i].id == target.id) return childs[i];
            var gScore = currentNode.g + currentNode.cost;
            var gScoreIsBetter = false;
            if (!containNode(openList, childs[i])) {
                gScoreIsBetter = true;
                childs[i].h = heuristic(childs[i].value, target.value);
                openList.push(childs[i]);
            } else if (gScore < childs[i].g)
                gScoreIsBetter = true;
            if (gScoreIsBetter) {
                childs[i].g = gScore;
                childs[i].f = childs[i].g + childs[i].h;
            }
        }
    }
    return null;
}