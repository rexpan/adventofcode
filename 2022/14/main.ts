import { sum } from "lodash-es";
import { equal } from "node:assert";
import { readFile } from "node:fs/promises";

type Point = [number, number]
type Edge = [number, number, number] // Vertical x, y0 < y1  Horizontal  x0 < x1, y

main()
async function main() {
    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));

    const lines = input.split(/\r?\n/).filter(Boolean).map(line => line.split(" -> ").map(p => p.split(",").map(Number) as Point))

    const maxX = (Math.max(...lines.flatMap(points => points.map(p => p[0]))));
    const maxY = (Math.max(...lines.flatMap(points => points.map(p => p[1]))));
    const map = createGrid(maxY+1+2, maxX+1+200, () => 0)
    fillMap(map, lines)

    console.log(part1(structuredClone(map)))
    console.log(part2(map))
}
function part1(map:number[][]) {
    let nSand = 0;
    while (true) {
        const [x,y] = simulate([500,0], map)
        if (!Number.isFinite(x) || !Number.isFinite(y)) break;
        map[y][x] = 2
        ++nSand
    }
    return (nSand)
}
function part2(map:number[][]) {
    fillMap(map, [[[0, map.length-1],[map[0].length-1, map.length-1]]])

    let nSand = 0;
    while (true) {
        const [x,y] = simulate([500,0], map)
        if (!Number.isFinite(x) || !Number.isFinite(y)) { break; }
        map[y][x] = 2
        ++nSand
        if (x == 500 && y == 0) { break; }
    }
    return(nSand)
}

function toEdges(points: Point[]) {
    const verticalEdges   : Edge[] = []
    const horizontalEdges : Edge[] = []
    for (let i = 1; i < points.length; i++) {
        const s = points[i-1]
        const e = points[i  ]
        if (s[0] == e[0]) {
            if (s[1] < e[1]) verticalEdges  .push([s[0], s[1], e[1]])
            else             verticalEdges  .push([s[0], e[1], s[1]])
        } else if (s[1] == e[1]) {
            if (s[0] < e[0]) horizontalEdges.push([s[0], e[0], s[1]])
            else             horizontalEdges.push([e[0], s[0], s[1]])
        } else console.warn(s, e)
    }
    return { verticalEdges, horizontalEdges }
}
function compareEdge([x0,y0,z0]:Edge, [x1,y1,z1]:Edge) { return (x0 - x1) || (y0 - y1) || (z0-z1) }

function fillMap(map:number[][], lines:Point[][]) {
    for (const line of lines) {
        const { verticalEdges, horizontalEdges  } = toEdges(line)
        for (const [x, y0, y1] of verticalEdges  ) for (let y = y0; y <= y1; ++y) { map[y][x] = 1 }
        for (const [x0, x1, y] of horizontalEdges) for (let x = x0; x <= x1; ++x) { map[y][x] = 1 }
    }
}

function createGrid<T>(nRow:number, nColumn:number, selector:(row:number,column:number) => T) {
    return Array.from({ length: nRow }, (_,r) => Array.from({ length: nColumn }, (_,c) => selector(r,c)))
}

function simulate(sand:Point, map:number[][]) {
    let [x,y] = sand
    while (true) {
        if (x < 0 || map[0].length <= x) { return [Infinity, y] }
        if (map.length-1 <= y) { return [x, Infinity] }
        if (map[y+1][x  ] < 1) { y += 1;         continue; }
        if (map[y+1][x-1] < 1) { y += 1; x -= 1; continue; }
        if (map[y+1][x+1] < 1) { y += 1; x += 1; continue; }
        return [x,y]
    }
}

function printMap(map:number[][], [x0,y0]:Point, [x1,y1]:Point) {
    const s = []
    for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
            if (x == 500 && y == 0) s.push('+')
            else if (map[y][x] == 0) s.push('.')
            else if (map[y][x] == 1) s.push('#')
            else if (map[y][x] == 2) s.push('o')
        }
        s.push('\n')
    }
    return s.join('')
}
