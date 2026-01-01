import type { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error(`[!] Unhandled error: ${err.message}`);
    res.status(500).json({
        success: false,
        error: "Internal server error",
        message: err.message,
    });
}

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        error: "Not found",
        message: `Route ${req.method} ${req.path} not found`,
    });
}
