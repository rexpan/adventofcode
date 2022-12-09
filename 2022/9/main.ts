import { max } from "lodash-es";
import { readFile } from "node:fs/promises";

interface IPosition { x:number, y:number }
interface Instruction { direction:string, move:number }

main()
async function main() {
    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));
    const instructions = input.split(/\r?\n/).filter(Boolean).map(s => s.split(" ")).map(([direction, move]) => ({ direction, move:Number(move) }));

    console.log(part1(instructions))
    console.log(part2(instructions))
}
function part1(instructions:Instruction[]) {
    const start = { x:0, y:0 }
    let head = structuredClone(start)
    let tail = structuredClone(start)
    const tailPositions = new Set([p2s(tail)])

    for (const instruction of instructions) {
        for (let i = 0; i < instruction.move; ++i) {
            move(head, instruction.direction);
            elasticMove(head, tail)
            tailPositions.add(p2s(tail))
        }
    }
    return(tailPositions.size)
}
function part2(instructions:Instruction[]) {
    const start = { x:0, y:0 }
    let head = structuredClone(start)
    let k1 = structuredClone(start)
    let k2 = structuredClone(start)
    let k3 = structuredClone(start)
    let k4 = structuredClone(start)
    let k5 = structuredClone(start)
    let k6 = structuredClone(start)
    let k7 = structuredClone(start)
    let k8 = structuredClone(start)
    let k9 = structuredClone(start)
    const tailPositions = new Set([p2s(k9)])

    for (const instruction of instructions) {
        for (let i = 0; i < instruction.move; ++i) {
            move(head, instruction.direction);
            elasticMove(head, k1)
            elasticMove(k1,k2)
            elasticMove(k2,k3)
            elasticMove(k3,k4)
            elasticMove(k4,k5)
            elasticMove(k5,k6)
            elasticMove(k6,k7)
            elasticMove(k7,k8)
            elasticMove(k8,k9)
            tailPositions.add(p2s(k9))
        }
    }
    return(tailPositions.size)
}
function move(position:IPosition, direction:string) {
    switch(direction) {
        case "L": { position.y -= 1; break; }
        case "R": { position.y += 1; break; }
        case "U": { position.x += 1; break; }
        case "D": { position.x -= 1; break; }
        default: console.warn(direction)
    }
}
function isTouch(head:IPosition, tail:IPosition) {
    return (Math.abs(head.x - tail.x) < 2) && (Math.abs(head.y - tail.y) < 2)
}
function elasticMove(head:IPosition, tail:IPosition) {
    if (isTouch(head, tail)) return
    if (head.x < tail.x) tail.x -= 1; else if (head.x > tail.x) tail.x += 1;
    if (head.y < tail.y) tail.y -= 1; else if (head.y > tail.y) tail.y += 1;
}
function p2s(p:IPosition) { return JSON.stringify(p) }
function logPositions(ps:IPosition[]) {
    const maxX = max(ps.map(p => p.x))
    const maxY = max(ps.map(p => p.y))
    const grid = createGrid(maxX+1, maxY+1, () => ".")
    for (const p of ps) grid[p.x][p.y] = "#"
    logGrid(grid)
}
function createGrid<T>(nRow:number, nColumn:number, selector:(row:number,column:number) => T) {
    return Array.from({ length: nRow }, (_,r) => Array.from({ length: nColumn }, (_,c) => selector(r,c)))
}
function forGrid<T>(grid:T[][], f:(x:T,r:number,c:number) => void) {
    const nColumn = grid[0]!.length
    const nRow = grid.length

    for (let r = 0; r < nRow; ++r) {
        for (let c = 0; c < nColumn; ++c) {
            f(grid[r][c], r, c)
        }
    }
}
function logGrid(grid:string[][]) {
    grid.slice().reverse().forEach(row => console.log(row.join("")))
}
