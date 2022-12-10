import { chunk } from "lodash-es";
import { equal } from "node:assert";
import { readFile } from "node:fs/promises";

const cycles = { noop:1, addx:2 }
interface Instruction { i:keyof typeof cycles, V:number }

main()
async function main() {
    {
        equal(is20(19, 20),  0)
        equal(is20(19, 21), 20)
        equal(is20(20, 21), 20)
        equal(is20(59, 60),  0)
        equal(is20(59, 61), 60)
        equal(is20(59, 61), 60)
        equal(is20(60, 61), 60)
    }

    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));
    const instructions = input.split(/\r?\n/).filter(Boolean).map<Instruction>(s =>
        s == "noop" ? { i:"noop", V:0 }
                    : { i:"addx", V:Number(s.split(" ")[1]) })
    console.log(part1(instructions))
    console.log(part2(instructions))
}
function part1(instructions:Instruction[]) {
    let sum = 0;

    let cycle = 1;
    let X = 1;
    for (const instruction of instructions) {
        const nextCycle = cycle + cycles[instruction.i]

        const cycle20th = is20(cycle, nextCycle)
        if (cycle20th) sum += cycle20th * X

        cycle = nextCycle;
        if (instruction.i == "addx") X += instruction.V
    }

    return sum
}
function part2(instructions:Instruction[]) {
    const crt:string[] = []

    let cycle = 1;
    let X = 1;
    for (const instruction of instructions) {
        const nextCycle = cycle + cycles[instruction.i]
        for (let c = cycle; c < nextCycle; c++) {
            const i = (c % 40) - 1 // cycle 1 ~ CRT position 0
            crt.push((((X-1) <= i) && (i <= (X+1))) ? "█" : " ")
        }
        cycle = nextCycle;
        if (instruction.i == "addx") X += instruction.V
    }
    return chunk(crt, 40).map(ps => ps.join("")).join("\n")
}

function is20(cycle:number, nextCycle:number) {
    if (cycle < 20) return 20 < nextCycle ? 20 : 0
    if (cycle == 20) return 20
    if (((cycle-20) % 40) == 0) return cycle
    if (((nextCycle-20) % 40) == 0) return 0
    const c = Math.floor((cycle-20) / 40)
    const n = Math.floor((nextCycle-20) / 40)
    return c < n ? (n*40 + 20)  : 0
}

