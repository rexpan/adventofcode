import { readFile } from "node:fs/promises";

main()
async function main() {
    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));
    const rows = input.split(/\r?\n/).filter(Boolean).map(s => s.split("").map(Number));

    console.log(part1(rows))
    console.log(part2(rows))
}

function part1(grid:number[][]) {
    const left = grid.map(row => visibleBlock(row));
    const right = grid.map(row => visibleBlock(row.slice().reverse()).reverse());
    const down = transpose(transpose(grid).map(row => visibleBlock(row)));
    const up = transpose(transpose(grid).map(row => visibleBlock(row.slice().reverse()).reverse()));

    const nColumn = grid[0]!.length
    const nRow = grid.length

    let count = 2*nColumn + 2*nRow - 4; // edge is visible
    for (let r = 1; r < nColumn-1; ++r) {
        for (let c = 1; c < nRow-1; ++c) {
            const bl = left [r][c]
            const br = right[r][c]
            const bd = down [r][c]
            const bu = up   [r][c]
            const hc = grid [r][c]
            if (Math.min(bl,br,bd,bu) < hc) ++count
        }
    }
    return count
}
function part2(grid:number[][]) {
    const left = grid.map(row => scenicScoreLeft(row))
    const right = grid.map(row => scenicScoreLeft(row.slice().reverse()).reverse())
    const up = transpose(transpose(grid).map(col => scenicScoreLeft(col)))
    const down = transpose(transpose(grid).map(col => scenicScoreLeft(col.slice().reverse()).reverse()))

    const nColumn = grid[0]!.length
    const nRow = grid.length

    let max = 0
    for (let r = 1; r < nRow-1; r++) {
        for (let c = 1; c < nColumn-1; c++) {
            const scenicScore = left[r][c] * right[r][c]*up[r][c]*down[r][c]
            if (max < scenicScore) max = scenicScore
        }
    }
    return max
}

function logGrid(rows:number[][]) {
    for (const row of rows) console.log(row.join(""))
    console.log('-'.repeat(rows.length))
}
function transpose<T>(rows: T[][]) {
    return createGrid(rows[0].length, rows.length, (c,r) => rows[r][c])
    return Array.from({ length: rows[0].length }, (_,y) => Array.from({ length: rows.length }, (_,x) => rows[x][y]))
}
function createGrid<T>(nRow:number, nColumn:number, selector:(row:number,column:number) => T) {
    return Array.from({ length: nRow }, (_,r) => Array.from({ length: nColumn }, (_,c) => selector(r,c)))
}
function visibleBlock(row:number[]) {
    let max = 0
    return [0].concat(row.slice(0, -1).map((x) => max < x ? max = x : max))
}
function scenicScoreLeft(row:number[]) {
    const scores = Array.from({ length: row.length }, () => 0)
    for (let c = 1; c < row.length; ++c) {
        let s = 0
        for (let i = c-1; 0 <= i; --i) {
            ++s
            if (row[i] >= row[c]) break;
        }
        scores[c] = s
    }
    return scores;
}
