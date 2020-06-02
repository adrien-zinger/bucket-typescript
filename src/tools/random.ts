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
} 