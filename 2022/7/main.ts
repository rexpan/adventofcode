import { readFile } from "node:fs/promises";
import { min, sum } from "lodash-es";

interface IDir { path:string, paths:string[], files:{name:string, size:number}[], directories:string[], fileSize:number, size }

const totalSpace = 70000000
const requiredSpace = 30000000

main()
async function main() {
    const input = (await readFile(new URL("./input.txt", import.meta.url), { encoding:"utf-8" }));

    const fs = constructFileSystem(input.split(/\r?\n/));

    // part 1
    console.log(sum(Array.from(fs.values(), d => d.size).filter(s => s <= 1e5)))

    // part 2
    const unusedSpace = totalSpace - (fs.get("/")!.size);
    const needSpace = requiredSpace - unusedSpace;
    console.log(min(Array.from(fs.values(), d => d.size).filter(s => s >= needSpace)))
}
function constructFileSystem(lines:string[]) {
    const fs = new Map<string, IDir>();
    let paths = []
    let dir!: IDir;
    for (const line of lines) {
        if (line.startsWith("$ cd")) {
            const d = line.slice("$ cd ".length)
            if (d == "..") { paths.pop() }
            else if (d == "/") { paths.length = 0 }
            else paths.push(d)

            const path = p2s(paths)
            if (!fs.has(path)) fs.set(path, { path, paths, files:[], directories:[], fileSize:0, size:0 })
            dir = fs.get(path)!
        } else if (line.startsWith("$ ls")) {
            // console.log("ls")
        } else if (line.startsWith("dir ")) {
            const d = line.slice("dir ".length)
            dir.directories.push(d)
        } else if (line) {
            const [ sSize, name ] = line.split(" ")
            const size = Number(sSize)
            dir.files.push({ name, size })
            dir.fileSize += size
        }
    }

    calculateDirectorySize([]);
    return fs;

    function calculateDirectorySize(paths:string[]): number {
        const dir = fs.get(p2s(paths))
        if (dir == null) { console.warn("path not found", paths); return 0 }
        return dir.size = dir.fileSize + sum(dir.directories.map(d => calculateDirectorySize(paths.concat(d))))
    }
}

function p2s(paths:string[]) { return "/"+paths.join("/") }
