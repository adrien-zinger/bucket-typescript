/**
 * A lot of problems need a path finder, here I provvide my one version of the a* algorithm
 * 
 */

// Algo Utils
function pathHeuristic(x1: number, y1: number, x2: number, y2: number): number {
    var d1 = Math.abs (x2 - x1);
    var d2 = Math.abs (y2 - y1);
    return d1 + d2;
}

function removeNode(list: ANode[], node: ANode): ANode[] {
    return list.filter((n: ANode) => !(n.x == node.x && n.y == node.y));
}

function containNode(list: ANode[], node: ANode): boolean {
    for (let el of list)
        if (el.x == node.x && el.y == node.y)
            return true;
    return false;
}

function getFullPathToReturn(node: ANode | null): [number, number][] {
    let ret: [number, number][] = [];
    while (node != null) {
        ret.push([node.x, node.y]);
        node = node.parent;
    }
    return ret;
}

export class ANode {
    f: number = 0; // Final score
    g: number = 0; // Distance score
    h: number = 0; // heuristic score
    parent: ANode | null = null;
    constructor(public x: number, public y: number) {}
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
 * @param pathChilds function returning the next childs in the graph from x, y
 * 
 * @returns a list of position [x, y] if the path is found, an empty list otherwise
 */
export function process(head: ANode,
    endx: number, endy: number,
    pathChilds: (x: number, y: number) => ANode[]): [number, number][] {

    // Algorithm Implementation
    let openList: ANode[] = [head];
    let closedList: ANode[] = [];

    // Find all neighbors for the current node.
    while(openList.length > 0) {
        openList.sort((a: ANode, b: ANode) => a.f - b.f);
        let currentNode: ANode = openList.shift()!;
        openList = removeNode(openList, currentNode);
        closedList.push(currentNode);
        let neighbors = pathChilds(currentNode.x, currentNode.y);
        for(let i: number = 0; i < neighbors.length; ++i) {
            let neighbor: ANode = neighbors[i];
            neighbor.parent = currentNode;
            if (neighbor.x == endx && neighbor.y == endy) {
                return getFullPathToReturn(neighbor);
            }
            if(containNode(closedList, neighbor)) {
                    // not a valid node to process, skip to next neighbor
                    continue;
            }
            var gScore = currentNode.g + 1;
            var gScoreIsBest = false;
            if (!containNode(openList, neighbor)) {
                // This the the first time we have arrived at this node, it must be the best
                // Also, we need to take the h (heuristic) score since we haven't done so yet
                gScoreIsBest = true;
                neighbor.h = pathHeuristic(neighbor.x, neighbor.y, endx, endy);
                openList.push(neighbor);
            } else if (gScore < neighbor.g) {
                // We have already seen the node, but last time it had a worse g (distance from start)
                gScoreIsBest = true;
            }
            if (gScoreIsBest) {
                // Found an optimal (so far) path to this node.	Store info on how we got here and
                //	just how good it really is...
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }
    return []
}