import { readFile } from "node:fs/promises";

interface IMonkey { id:number, items:number[], operation:(old:number) => number, test:number, ifTrue:number, ifFalse:number, inspectedTime:number }

main()
async function main() {
    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));

    const monkeys = Array.from(parseMonkey(input));
    if (false) for (const m of monkeys) logMonkey(m)

    console.log(process(monkeys.map(cloneMoney), 20, (x:number) => Math.floor(x / 3)))

    const M = monkeys.map(m => m.test).reduce((p, x) => p*x, 1)
    console.log(process(monkeys.map(cloneMoney), 10000, (x:number) => (x % M)))
}
function* parseMonkey(input:string) {
    let monkey!: IMonkey;
    for (const line of input.split(/\r?\n/)) {
        if (line.startsWith("Monkey ")) {
            monkey = { id: Number(line.match(/\d+/)![0]), items:[], operation:(x) => x, test:1, ifTrue:0, ifFalse:0, inspectedTime:0 }
            yield monkey
            continue;
        }
        const [key, value] = line.split(":")
        if (key == "  Starting items") {
            monkey.items = value.split(", ").map(Number)
        } else if (key == "  Operation") {
            monkey.operation = new Function("old", value.replace("new =", "return")) as any
        } else if (key == "  Test") {
            monkey.test = Number(value.match(/\d+/)![0])
        } else if (key == "    If true") {
            monkey.ifTrue = Number(value.match(/\d+/)![0])
        } else if (key == "    If false") {
            monkey.ifFalse = Number(value.match(/\d+/)![0])
        }
    }
}
function logMonkey(monkey:IMonkey) {
    console.log("%d: | if divisible by %d then monkey %d else monkey %d | %s", monkey.id, monkey.test, monkey.ifTrue, monkey.ifFalse, monkey.items.join(", "))
}
function process(monkeys:IMonkey[], maxRound:number, manageWorryLevel: (worryLevel:number) => number) {
    for (let round = 0; round < maxRound; ++round) {
        // console.group("Round %d", round)
        for (const monkey of monkeys) {
            // console.group("Monkey %d", monkey.id)
            for (const item of monkey.items) {
                const newWorryLevel = manageWorryLevel(monkey.operation(item))
                const throwTo = (newWorryLevel % monkey.test) == 0 ? monkey.ifTrue : monkey.ifFalse
                monkeys[throwTo]!.items.push(newWorryLevel);
                // console.log("%d -> %d throw to %d", item, newWorryLevel, throwTo)
                ++monkey.inspectedTime;
            }
            monkey.items.length = 0
            // console.groupEnd()
        }
        // console.groupEnd()
    }
    const [max1, max2] = monkeys.map(m => m.inspectedTime).sort((a,b) => b-a)
    return (max1*max2)
}
function cloneMoney(monkey:IMonkey) { return ({ ...monkey, items:monkey.items.slice() }) }
