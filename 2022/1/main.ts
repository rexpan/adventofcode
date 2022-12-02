import { readFile } from "node:fs/promises";
import { sum } from "lodash-es";
import { EOL } from "node:os"

main()
async function main() {
    const txt = await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" });
    const [e1, e2, e3] = txt.split(EOL.repeat(2)).map(s => sum(s.split(EOL).map(Number))).sort((a,b) => b-a)
    console.log(e1)
    console.log(e1+e2+e3)
}
