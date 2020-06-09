import { BisectionApproach } from "./tools/algos/bisection";

const range: [number, number] = [0, 5];
const target: number = 0;
let lastIndex = 1;
let found: number | undefined = undefined;
function closer(index: number) {
    console.log("closer enter: ", index)
    let ab: number, ac: number;
    if (lastIndex > target) ab = lastIndex - target;
    else ab = target - lastIndex;
    if (index > target) ac = index - target;
    else ac = target - index;
    const difference = ab - ac;
    lastIndex = index;
    return difference;
}
let bisection = new BisectionApproach(closer, range, lastIndex);
for (let i = 0; i < 13; ++i)
    bisection.run();
console.log(bisection.result);