import { readFile } from "node:fs/promises";
import { EOL } from "node:os"

main()
async function main() {
    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));
    const sectionAssignmentPairs = input.split(EOL).filter(Boolean).map(s => s.split(",")).map(ss => ss.map(s => s.split("-").map(Number) as [number, number]) as [[number, number], [number,number]]);

    console.log(count(sectionAssignmentPairs, ([[s1s, s1e], [s2s, s2e]]) => ((s1s <= s2s && s2e <= s1e) || (s2s <= s1s && s1e <= s2e))));
    console.log(count(sectionAssignmentPairs, ([[s1s, s1e], [s2s, s2e]]) => ((s1s <= s2s && s2s <= s1e) || (s2s <= s1s && s1s <= s2e))));
}

function count<T>(xs:T[], f: (x:T) => boolean) { return xs.reduce((count, x) => count + (f(x) ? 1 : 0), 0) }
