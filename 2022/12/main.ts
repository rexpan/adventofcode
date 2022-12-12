import { equal } from "node:assert";
import { readFile } from "node:fs/promises";

const elevation = Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split("").map((c, i) => [c,i]).concat([['S',0], ['E',25]])); equal(elevation['z'], elevation['E']);
type IPosition = [x:number, y:number]

main()
async function main() {
    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));

    const map = input.split(/\r?\n/).filter(Boolean).map(row => row.split(""))
    // console.log(map.map((row) => row.join("")).join("\n"))
    // console.log()

    const S = findE(map,'S'); console.assert(-1 < S[0] && -1 < S[1] && map[S[0]][S[1]] == 'S'); // console.log('S %d %d', ...S)
    const E = findE(map,'E'); console.assert(-1 < E[0] && -1 < E[1] && map[E[0]][E[1]] == 'E'); // console.log('E %d %d', ...E)

    console.log(findPath(map, S, E))
    console.log(findPath(map, E, E, (n) => map[n.p[0]][n.p[1]] == 'a' || map[n.p[0]][n.p[1]] == 'S', -1))
}
interface INode { p:IPosition, from:IPosition, n:number }
function findPath(map:string[][], S:IPosition, E:IPosition,
    isFound:((node:INode) => boolean) = (y => pEqual(y.p, E)),
    direction:1|-1 = 1) {
    const queue = [ { p:S, from:S, n:0 } ];
    const visited = new Map<string, INode>();

    for (const n of queue) visit(n)

    while(0 < queue.length) {
        const x = queue.shift()!
        const ys = Array.from(moveableNeighbor(x.p, E, map, direction)).sort((x,y) => y.score-x.score).map((x) => x.p).filter(y => !isVisited(y)).map(p => ({ p, from:x.p, n:x.n+1 }) satisfies INode)
        const nE = ys.find(y => isFound(y))
        if (nE) return nE.n
        queue.push(...ys)
        for (const y of ys) visit(y)
    }
    console.log(map.map((row, r) => row.map((x, c) => (x =='E' || isVisited([r,c])) ? x : " ").join("")).join("\n"))
    console.log("-----------------------------------------------------------------")
    console.log(map.map((row, r) => row.map((x, c) => (!isVisited([r,c])) ? x : " ").join("")).join("\n"))
    return -1

    function isVisited(p:IPosition) { return visited.has(toS(p)) }
    function visit(n:INode) { return visited.set(toS(n.p), n) }
}
function pEqual(X:IPosition, Y:IPosition) { return X[0] == Y[0] && X[1] == Y[1] }
function* moveableNeighbor([fromR, fromC]:IPosition, [Er, Ec]:IPosition, map:string[][], direction:1|-1) {
    for(const [toR, toC] of [
        [fromR-1, fromC],
        [fromR+1, fromC],
        [fromR, fromC-1],
        [fromR, fromC+1],
    ]) {
        if (toR < 0 || toC < 0) continue
        if (toR >= map.length) continue
        if (toC >= map[0].length) continue

        const fromElevation = elevation[map[fromR][fromC]]
        const toElevation = elevation[map[toR][toC]]
        if (1 < ((toElevation - fromElevation)*direction)) continue

        const score = 0
            + (fromElevation < toElevation ? 3 : 0)
            + ((Math.abs(fromR-Er) < Math.abs(toR-Er)) ? -1 : (Math.abs(fromR-Er) > Math.abs(toR-Er) ? 1 : 0))
            + ((Math.abs(fromC-Ec) < Math.abs(toC-Er)) ? -1 : (Math.abs(fromC-Er) > Math.abs(toC-Er) ? 1 : 0))

        yield { p:[toR, toC] as IPosition, score }
    }
}
function toS(p:IPosition) { return JSON.stringify(p) }
function findE(map:string[][], x:string): IPosition {
    let c = -1
    const r = map.findIndex(row => (c = row.findIndex(c => c == x)) >= 0)
    return [r, c]
}
