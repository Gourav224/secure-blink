import type { Request, Response } from "express";
import { readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type {
    ScanListResponse,
    EnumerationResult,
    ApiResponse,
} from "../types";
import { getOutputsDir, isValidFilename } from "../utils/path.helper";

export async function listScans(
    req: Request,
    res: Response<ScanListResponse>
): Promise<void> {
    try {
        const outputDir = getOutputsDir();

        if (!existsSync(outputDir)) {
            res.json({
                count: 0,
                scans: [],
                message: "No scans found",
            });
            return;
        }

        const files = await readdir(outputDir);

        const jsonFiles = files
            .filter((f) => f.endsWith(".json"))
            .map((f) => ({
                filename: f,
                path: `/scans/${f}`,
            }));

        res.json({
            count: jsonFiles.length,
            scans: jsonFiles,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            count: 0,
            scans: [],
            message: `Failed to list scans: ${errorMessage}`,
        });
    }
}

export async function getScan(
    req: Request<{ filename: string }>,
    res: Response<EnumerationResult | ApiResponse<null>>
): Promise<void> {
    try {
        const { filename } = req.params;

        // Security: Prevent directory traversal
        if (!isValidFilename(filename)) {
            res.status(400).json({
                success: false,
                error: "Invalid filename",
                message: "Filename cannot contain path traversal characters",
            });
            return;
        }

        const outputsDir = getOutputsDir();
        const filePath = path.join(outputsDir, filename);

        if (!existsSync(filePath)) {
            res.status(404).json({
                success: false,
                error: "Scan not found",
                message: `No scan found with filename: ${filename}`,
            });
            return;
        }

        const data = await readFile(filePath, "utf-8");
        const results: EnumerationResult = JSON.parse(data);

        res.json(results);
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            error: "Failed to read scan",
            message: errorMessage,
        });
    }
}
