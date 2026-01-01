import type { Request, Response } from "express";
import type { HealthCheckResponse } from "../types";

export function healthCheck(
    req: Request,
    res: Response<HealthCheckResponse>
): void {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "subdomain-enumeration-api",
    });
}
