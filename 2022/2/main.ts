import { readFile } from "node:fs/promises";
import { sum } from "lodash-es";
import { EOL } from "node:os"

type RPS = 'R'|'P'|'S'
type XYZ = 'X'|'Y'|'Z'

const RpsMap: Record<string, RPS> = {
    A:'R',
    B:'P',
    C:'S',
} as const
const RpsMap1: Record<XYZ, RPS> = {
    X:'R',
    Y:'P',
    Z:'S',
}
const RpsXyzMap: Record<`${RPS}${XYZ}`, RPS> = {
 // R       P       S
    RX:'S', PX:'R', SX:'P', // X: lose
    RY:'R', PY:'P', SY:'S', // Y: draw
    RZ:'P', PZ:'S', SZ:'R', // Z: win
}
const ResultMap: Record<`${RPS}${RPS}`, -1|0|1> = {
    RR: 0, PR:-1, SR: 1,
    RP: 1, PP: 0, SP:-1,
    RS:-1, PS: 1, SS: 0,
}
const ShapeScore = {
    R:1,
    P:2,
    S:3,
} as const
const ResultScoreMap: Record< -1|0|1, number> = { '-1':0, "0":3, "1":6 }
function roundScore(a:RPS, b:RPS) { return ResultScoreMap[ResultMap[`${a}${b}`]] + ShapeScore[b] }

main()

async function main() {
    const txt = await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" });
    const rounds = txt.split(EOL).filter(Boolean).map(s => s.split(" ") as [string, XYZ])

    const p1Rounds = rounds.map(([a,b]) => ([RpsMap[a], RpsMap1[b]] as const));
    console.log(sum(p1Rounds.map(([a, b]) => roundScore(a, b))));

    const p2Rounds = rounds.map(([a,b]) => ([RpsMap[a], RpsXyzMap[`${RpsMap[a]}${b}`]] as const));
    console.log(sum(p2Rounds.map(([a, b]) => roundScore(a, b))));
}
