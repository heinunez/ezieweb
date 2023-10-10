import { homedir } from "os";
import path from "path";
import fs from "fs";

const prefFile = path.join(homedir(), ".ezieweb");

export function savePrefs(prefs: Prefs): void {
    fs.writeFileSync(prefFile, `${prefs.basePath}\n${prefs.username}\n${prefs.password}`);
}

export function getPrefs(): Prefs | null {
    try {
        const data = fs.readFileSync(prefFile, { encoding: "utf8", flag: "r" })?.split("\n");
        if (data) {
            return { basePath: data[0], username: data[1], password: data[2] };
        }
    } catch (_) {
        return null;
    }
    return null;
}

export interface Prefs {
    basePath: string;
    username: string;
    password: string;
}
