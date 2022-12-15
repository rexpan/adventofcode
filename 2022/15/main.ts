import { sum, uniq } from "lodash-es";
import { equal } from "node:assert";
import { count } from "node:console";
import { readFile } from "node:fs/promises";

interface Section { s:number, e:number }
interface Sensor {s:{x:number, y:number},b:{x:number, y:number}}
main()
async function main() {
    const sample = [
        {s:{x:2 , y:18}, b:{x:-2, y:15}},
        {s:{x:9 , y:16}, b:{x:10, y:16}},
        {s:{x:13, y:2 }, b:{x:15, y: 3}},
        {s:{x:12, y:14}, b:{x:10, y:16}},
        {s:{x:10, y:20}, b:{x:10, y:16}},
        {s:{x:14, y:17}, b:{x:10, y:16}},
        {s:{x:8 , y:7 }, b:{x: 2, y:10}},
        {s:{x:2 , y:0 }, b:{x: 2, y:10}},
        {s:{x:0 , y:11}, b:{x: 2, y:10}},
        {s:{x:20, y:14}, b:{x:25, y:17}},
        {s:{x:17, y:20}, b:{x:21, y:22}},
        {s:{x:16, y:7 }, b:{x:15, y: 3}},
        {s:{x:14, y:3 }, b:{x:15, y: 3}},
        {s:{x:20, y:1 }, b:{x:15, y: 3}},
    ];
    const sensors = [
        { s:{x:2557568 , y:3759110 }, b: { x:2594124, y:3746832 } },
        { s:{x:2684200 , y:1861612 }, b: { x:2816974, y:2000000 } },
        { s:{x:1003362 , y:1946094 }, b: { x:1972523, y:2563441 } },
        { s:{x:2142655 , y:1481541 }, b: { x:1932524, y: 967542 } },
        { s:{x:2796219 , y:1955744 }, b: { x:2816974, y:2000000 } },
        { s:{x:3890832 , y:1818644 }, b: { x:3454717, y:2547103 } },
        { s:{x:2828842 , y:1921726 }, b: { x:2816974, y:2000000 } },
        { s:{x:2065227 , y: 583957 }, b: { x:1932524, y: 967542 } },
        { s:{x:2725784 , y:2088998 }, b: { x:2816974, y:2000000 } },
        { s:{x:3574347 , y: 927734 }, b: { x:1932524, y: 967542 } },
        { s:{x:2939312 , y:2652370 }, b: { x:3454717, y:2547103 } },
        { s:{x:2495187 , y:3681541 }, b: { x:2431306, y:3703654 } },
        { s:{x:2878002 , y:2054681 }, b: { x:2816974, y:2000000 } },
        { s:{x:1539310 , y:3235516 }, b: { x:1972523, y:2563441 } },
        { s:{x: 545413 , y: 533006 }, b: { x:-538654, y:  69689 } },
        { s:{x:1828899 , y:3980292 }, b: { x:2431306, y:3703654 } },
        { s:{x:3275729 , y:2937931 }, b: { x:3454717, y:2547103 } },
        { s:{x: 600131 , y:3861189 }, b: { x:2431306, y:3703654 } },
        { s:{x:2089895 , y:  28975 }, b: { x:1932524, y: 967542 } },
        { s:{x:2960402 , y:3942666 }, b: { x:2594124, y:3746832 } },
        { s:{x:3785083 , y:3905392 }, b: { x:2594124, y:3746832 } },
        { s:{x:1721938 , y:1077173 }, b: { x:1932524, y: 967542 } },
        { s:{x:2515156 , y:3751221 }, b: { x:2594124, y:3746832 } },
        { s:{x:2469423 , y:2109095 }, b: { x:2816974, y:2000000 } },
        { s:{x:1776986 , y: 904092 }, b: { x:1932524, y: 967542 } },
        { s:{x:2789294 , y:3316115 }, b: { x:2594124, y:3746832 } },
        { s:{x:3538757 , y:2695066 }, b: { x:3454717, y:2547103 } },
        { s:{x:2299738 , y:2708004 }, b: { x:1972523, y:2563441 } },
        { s:{x:2388366 , y:3234346 }, b: { x:2431306, y:3703654 } },
    ];
    console.log(part1(sample, 10));
    console.log(part2(sample, 20));
    console.log(part1(sensors, 2e6));
    console.log(part2(sensors, 4e6));
}
function part2(ss:Sensor[], max:number) {
    for (let y = 0; y <= max; y++) {
        const sections = sectionsMinus([{s:0,e:max}], noBeaconSections(ss, y));
        if (sections.length < 1) continue
        return sections[0].s * 4e6 + y
    }
}
function part1(ss:Sensor[], y:number) {
    const sections = noBeaconSections(ss, y)
    const bs = uniq(ss.filter(s => s.b.y == y).map(s => s.b.x))
    return(sum(sections.map(s => Math.abs(s.e - s.s + 1) - bs.filter(x => s.s <= x && x <= s.e).length)))
}
function noBeaconSections(ss:Sensor[], y:number) {
    return normalizeSections(ss.map(({s,b}) => {
        const d = Math.abs(s.x - b.x) + Math.abs(s.y - b.y) - Math.abs(y - s.y)
        if (d < 0) return undefined
        return ({s: s.x-d, e: s.x+d})
    }).filter(notNull))
}

function normalizeSections(sections: Section[]) {
    if (sections.length < 1) return sections;
    sections = sections.slice().sort((x,y) => (x.s - y.s) || (x.e - y.e))
    const ss = [sections[0]];
    for (let i = 1; i < sections.length; i++) {
        const p = ss.at(-1)!
        const s = sections[i];
        if (s.s <= p.e) { if (p.e < s.e) p.e = s.e }
        else ss.push(p)
    }
    return ss;
}
function sectionMinus(x:Section, y:Section) {
    if (x.e < y.s) return [x]
    if (x.s < y.s) {
        if (x.e <= y.e) return [{ s:x.s, e:y.s-1 }]
        return [{ s:x.s, e:y.s-1 }, {s:y.e+1, e:x.e}]
    }
    if (x.e <= y.e) return[]
    return [{s:y.e+1, e:x.e}]
}
function sectionsMinusSection(xs:Section[], y:Section) {
    return normalizeSections(xs.flatMap(x => sectionMinus(x, y)))
}
function sectionsMinus(xs:Section[], ys:Section[]) {
    return ys.reduce((xs, y) => sectionsMinusSection(xs, y), xs)
}

function notNull<T>(x: T|null|undefined): x is T { return x != null }
