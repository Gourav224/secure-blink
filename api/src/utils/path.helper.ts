import { existsSync } from "fs";
import path from "path";

export function getOutputsDir(): string {
    return existsSync("/outputs")
        ? "/outputs"
        : path.join(process.cwd(), "../outputs");
}

export function isValidFilename(filename: string): boolean {
    return !(
        filename.includes("..") ||
        filename.includes("/") ||
        filename.includes("\\")
    );
}
