import { sum } from "lodash-es";
import { equal } from "node:assert";
import { readFile } from "node:fs/promises";

const TEST = false

main()

async function main() {
    if (TEST) {
        equal(compare(1,1), 0)
        equal(compare(3,5),-2)
        equal(compare([1,1,3,1,1],[1,1,5,1,1]),-2)
        equal(compare([1],[1]),0)
        equal(compare([2,3,4],4),-2)
        equal(compare([[1],[2,3,4]] , [[1],4]),-2)
        equal(compare(9 , [8,7,6]),1)
        equal(compare([9] , [[8,7,6]]),1)
        equal(compare( [[4,4],4,4] , [[4,4],4,4,4]),-1)
        equal(compare( [7,7,7,7] , [7,7,7]),1)
        equal(compare( [] , [3]), -1)
        equal(compare( [[[]]] , [[]]), 1)
        equal(compare( [1,[2,[3,[4,[5,6,7]]]],8,9] , [1,[2,[3,[4,[5,6,0]]]],8,9]), 7)
    }

    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));

    const pairs = input.split(/\r?\n\r?\n/).filter(Boolean).map(pair => pair.split(/\r?\n/).map(line => { try { return JSON.parse(line) } catch(e) { console.error(line); return undefined } })).filter(x => x != null)
    console.log(sum(pairs.map((pairs, i) => compare(...pairs) < 1 ? i+1: 0)))

    const packets = pairs.flat().filter(x => x != null).concat([ [[2]], [[6]] ]);
    packets.sort(compare);
    // for (const packet of packets) console.log(JSON.stringify(packet))
    const x = packets.findIndex(packet => packet.length == 1 && packet[0].length == 1 && packet[0][0] == 2)
    const y = packets.findIndex(packet => packet.length == 1 && packet[0].length == 1 && packet[0][0] == 6)
    console.log((x+1)*(y+1))
}
type List = Array<number|List>
function compare(left:number|List, right:number|List):number {
    // console.log("compare( %s, %s )", JSON.stringify(left), JSON.stringify(right))
    if (typeof left == "number" && typeof right == "number") return left - right

    if (Array.isArray(left) && Array.isArray(right)) return compareArray(left, right)
    if (typeof left == "number") return compareArray([left], right as List)
    return compareArray(left, [right as number])
}
function compareArray(left:number[], right:number[]):number {
    // console.log("compareArray( %s, %s )", JSON.stringify(left), JSON.stringify(right))
    const n = Math.min(left.length, right.length)
    for (let i = 0; i < n; i++) {
        const x = compare(left[i], right[i])
        if (x != 0) return x;
    }
    return left.length - right.length
}


