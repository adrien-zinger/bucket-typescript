import fs from 'fs';

export interface File {
    data: string
}

export function getFileDatasSync(filename: string): File | null {
    let ret: File | null = null;
    if (fs.existsSync(filename)) {
        ret = {data: fs.readFileSync(filename, 'utf8')};
    }
    return ret;
}