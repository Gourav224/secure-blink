import { spawn } from "child_process";
import type { EnumerationResult } from "../types";

export async function runEnumerationInDocker(
    domain: string
): Promise<EnumerationResult> {
    return new Promise((resolve, reject) => {
        console.log(
            `[*] Starting Docker-based enumeration for domain: ${domain}`
        );

        // Run Python script inside the amass container
        const dockerCommand = spawn("docker", [
            "exec",
            "amass-tool",
            "python3",
            "/app/enumerate.py",
            domain,
        ]);

        let stdout = "";
        let stderr = "";

        dockerCommand.stdout.on("data", (data: Buffer) => {
            const output = data.toString();
            stdout += output;
            console.log(`[Docker/Python] ${output.trim()}`);
        });

        dockerCommand.stderr.on("data", (data: Buffer) => {
            const error = data.toString();
            stderr += error;
            console.error(`[Docker/Python Error] ${error.trim()}`);
        });

        dockerCommand.on("close", (code: number) => {
            if (code !== 0) {
                console.error(`[!] Docker command exited with code ${code}`);
                reject(new Error(stderr || `Process exited with code ${code}`));
                return;
            }

            try {
                // Parse JSON output from Python script
                const lines = stdout.trim().split("\n");
                const lastLine = lines[lines.length - 1];

                let results: EnumerationResult;

                try {
                    if (lastLine) {
                        results = JSON.parse(lastLine);
                    } else {
                        throw new Error("No output received from script");
                    }
                } catch (parseError) {
                    // Try to find JSON in the output
                    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
                    if (jsonMatch && jsonMatch[0]) {
                        results = JSON.parse(jsonMatch[0]);
                    } else {
                        throw new Error("Could not parse results from output");
                    }
                }

                console.log(`[+] Enumeration completed for ${domain}`);
                resolve(results);
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                console.error(`[!] Error processing results: ${errorMessage}`);
                reject(new Error(`Failed to process results: ${errorMessage}`));
            }
        });

        dockerCommand.on("error", (error: Error) => {
            console.error(
                `[!] Failed to start Docker command: ${error.message}`
            );
            reject(error);
        });
    });
}
