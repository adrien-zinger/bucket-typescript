import { BisectionApproach } from "./tools/algos/bisection";

const range: [number, number] = [1, 100];
const target: number = 57;
let lastIndex = 2;
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
for (let i = 0; i < 10; ++i) {
    bisection.run();
    if (bisection.predict) {
        bisection.run(1);
    }
}
console.log(bisection.result);