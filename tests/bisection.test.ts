import { BisectionApproach } from "../src/tools/algos/bisection";

describe('Test bisection algorithms', () => {
    it('simple bisection approach test', () => {
        const range: [number, number] = [0, 100];
        const target: number = 27;
        let lastDistance = 27;
        function closer(index: number) {
            console.log("closer")
            if (target > index) {
                console.log(target - index);
                lastDistance = (target - index) - lastDistance;
                return lastDistance;
            }
            else if (target < index) {
                console.log(target - index);
                lastDistance = (index - target) - lastDistance;
                return lastDistance;
            }
            return 0;
        }
        let bisection = new BisectionApproach(closer, range, 0);
        while (bisection.run());
        console.log(bisection.result);
    });
});