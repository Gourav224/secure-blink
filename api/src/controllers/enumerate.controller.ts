import type { Request, Response } from "express";
import type {
    EnumerationRequest,
    EnumerationResult,
    ApiResponse,
} from "~/types";
import { isValidDomain } from "~/utils/domain.validator";
import { runEnumerationInDocker } from "~/services/docker.service";

export async function enumerate(
    req: Request<{}, ApiResponse<EnumerationResult>, EnumerationRequest>,
    res: Response<ApiResponse<EnumerationResult>>
): Promise<void> {
    const { domain } = req.body;

    // Validation
    if (!domain) {
        res.status(400).json({
            success: false,
            error: "Domain is required",
            message: "Please provide a domain in the request body",
        });
        return;
    }

    // Domain format validation
    if (!isValidDomain(domain)) {
        res.status(400).json({
            success: false,
            error: "Invalid domain format",
            message: "Please provide a valid domain name (e.g., example.com)",
        });
        return;
    }

    try {
        // Run enumeration in Docker
        const results = await runEnumerationInDocker(domain);

        res.json({
            success: true,
            data: results,
            metadata: {
                processingTime: results.timestamp,
                totalSubdomains: results.total_subdomains,
                activeSubdomains: results.active_subdomains,
            },
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
        console.error(`[!] Enumeration error: ${errorMessage}`);

        res.status(500).json({
            success: false,
            error: "Enumeration failed",
            message: errorMessage,
        });
    }
}
