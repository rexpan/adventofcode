import { readFile } from "node:fs/promises";

main()
async function main() {
    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));
    const [sCrates, sProcedure] = input.split(" 1   2   3   4   5   6   7   8   9 ")

    const crateIndies = Array.from("[X] [X] [X] [X] [X] [X] [X] [X] [X]".matchAll(/X/g), (x) => x.index!);

    const stacks = Array.from({ length:9 }, () => [])
    sCrates.split("\n").filter(Boolean).map(s => crateIndies.map(i => s[i])).forEach(row => row.forEach((x, i) => x != " " && stacks[i].unshift(x)))

    const procedures = sProcedure.split("\n").filter(Boolean).map(step => {
        const m = step.match(/move (\d+) from (\d+) to (\d+)/)!;
        return ({ n: Number(m[1]), fromStack: Number(m[2]), toStack: Number(m[3]) });
    })

    const stacks1 = structuredClone(stacks)
    for (const step of procedures) { move1(step.n, stacks1[step.fromStack-1], stacks1[step.toStack-1]); }
    console.log(topCrates(stacks1).join(""))

    const stacks2 = structuredClone(stacks)
    for (const step of procedures) { move2(step.n, stacks2[step.fromStack-1], stacks2[step.toStack-1]); }
    console.log(topCrates(stacks2).join(""))
}
function move1(n:number, fromStack:number[], toStack: number[]) {
    while (0 < n-- && 0 < fromStack.length) {
        toStack.push(fromStack.pop()!)
    }
}
function move2(n:number, fromStack:number[], toStack: number[]) {
    n = Math.min(fromStack.length, n)
    toStack.push(...fromStack.slice(-n))
    fromStack.length = fromStack.length - n
}
function topCrates(stacks:number[][]) {
    return stacks.map(stack => stack.length < 1 ?  undefined : stack[stack.length-1])
}
