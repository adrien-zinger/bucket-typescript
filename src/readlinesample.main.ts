import {readline} from "./tools/readline";

async function asyncReading() {
    console.log("write a line");
    await readline().then(line => console.log(line));
    console.log("press enter");
    await readline();
}
function main() {
    asyncReading();
}

main();