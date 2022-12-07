import { readFile } from "node:fs/promises";
import { equal } from "node:assert";

main()
async function main() {
    equal(findStartOfMarker("mjqjpqmgbljsphdztnvjfqwrcgsmlb"    ,  4),  7)
    equal(findStartOfMarker("bvwbjplbgvbhsrlpgdmjqwftvncz"      ,  4),  5)
    equal(findStartOfMarker("nppdvjthqldpwncqszvftbrmjlhg"      ,  4),  6)
    equal(findStartOfMarker("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg" ,  4), 10)
    equal(findStartOfMarker("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"  ,  4), 11)

    equal(findStartOfMarker("mjqjpqmgbljsphdztnvjfqwrcgsmlb"    , 14), 19)
    equal(findStartOfMarker("bvwbjplbgvbhsrlpgdmjqwftvncz"      , 14), 23)
    equal(findStartOfMarker("nppdvjthqldpwncqszvftbrmjlhg"      , 14), 23)
    equal(findStartOfMarker("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg" , 14), 29)
    equal(findStartOfMarker("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"  , 14), 26)

    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));
    equal(findStartOfMarker(input, 4), 1723)
    equal(findStartOfMarker(input,14), 3708)
}
function findStartOfPacketMarker(input:string) {
    for (let i = 0; i < input.length - 3; i++) {
        const s = input.slice(i,i+4).split("")
        if ((new Set(s)).size == 4) { return i+4 }
        const [a,b,c,d] = s
        if (c == d) i+=2       // abcc -> skip 3
        else if (b == d) i+=1  // abcb -> skip 2
        else if (b == c) i+= 1 // abbd -> skip 2
    }
    return -1
}
function findStartOfMessageMarker(input:string, n=14) {
    for (let i = 0; i < input.length -n+1; i++) {
        const s = input.slice(i,i+n).split("")
        if ((new Set(s)).size == s.length) { return i+n }
    }
    return -1
}
function findStartOfMarker(input:string, n:number) {
    const mCount = new Map<string, number>();
    const mDup = new Set<string>();
    for (let i = 0; i < n; i++) {
        const c = input[i]
        const count = (mCount.get(c) || 0) + 1
        mCount.set(c, count)
        if (1 < count) mDup.add(c)
    }
    if (mDup.size < 1) { return n }

    for (let i = n; i < input.length; i++) {
        const c = input[i]
        const count = (mCount.get(c) || 0) + 1
        mCount.set(c, count)
        if (1 < count) mDup.add(c)

        {
            const c = input[i-n]
            const count = (mCount.get(c) || 0) - 1
            if (count < 0) console.warn("count < 0")
            mCount.set(c, count)
            if (count < 2) mDup.delete(c)
        }

        if (n <= i && mDup.size < 1) { return i+1 }
    }
    return -1
}
