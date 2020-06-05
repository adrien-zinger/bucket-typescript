export default class Random {
    /**
     * Return an integer value between min and max
     * @param min minimal value
     * @param max maximal value
     */
    public static range(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static shuffle(array: any[]): void {
        let currentIndex: number = array.length;
        let tmpValue: number;
        let randomIndex: number;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            tmpValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = tmpValue;
        }
    }
} 