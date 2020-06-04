import * as readlinelib from 'readline';

/**
 * The exercises in coding game reads inputs in this way so I did
 */
export async function readline(): Promise<string> {
    let ret: string = '';
    let consoleInterface: readlinelib.Interface = readlinelib.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    await new Promise((resolve: (msg: string) => void) =>
    consoleInterface.question('', (line: string) =>{
        consoleInterface.close();
        resolve(line);
    }))
    .then((line: string) => ret = line);
    return ret;
}