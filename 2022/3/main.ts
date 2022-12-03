import { readFile } from "node:fs/promises";
import { chunk, sumBy } from "lodash-es";
import { EOL } from "node:os"

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const mPriority = Object.fromEntries((alphabet+alphabet.toUpperCase()).split("").map((c,i) => [c, i+1]));

main()
async function main() {
    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));
    const rucksack = input.split(EOL);

    {
        const commonItemTypes = rucksack.map(s => [s.slice(0, s.length/2), s.slice(s.length/2)]).map((compartments) =>
            Array.from(intersection(compartments.map(compartment => new Set(compartment.split("")))))[0]
        );
        const sumOfPriorities = sumBy(commonItemTypes, itemType => mPriority[itemType] || 0)
        console.log(sumOfPriorities)
    }

    {
        const groups = chunk(rucksack, 3)
        const commonItemTypes = groups.map(rucksacks => Array.from(intersection(rucksacks.map(rucksack => new Set(rucksack.split("")))))[0])
        const sumOfPriorities = sumBy(commonItemTypes, itemType => mPriority[itemType] || 0)
        console.log(sumOfPriorities)
    }
}

function intersection<T>(ss: Array<Set<T>>) { return ss.reduce((intersection, s) => new Set(intersection2Set(intersection, s))) }
function intersection2Set<T>(s1: Set<T>, s2: Set<T>) { return Array.from(s1).filter(x => s2.has(x)) }
