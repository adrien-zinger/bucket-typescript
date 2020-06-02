import * as readlinelib from 'readline';

class ConsoleInterface {
    static readonly instance: readlinelib.Interface = readlinelib.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

/**
 * The exercises in coding game reads inputs in this way so I did
 */
export function readline(): string {
    let ret: string = '';
    ConsoleInterface.instance.question('', (line: string) => ret = line);
    return ret;
}