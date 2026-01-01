import express from "express";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import healthRoutes from "./routes/health.routes";
import enumerateRoutes from "./routes/enumerate.routes";
import scansRoutes from "./routes/scans.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use("/health", healthRoutes);
app.use("/enumerate", enumerateRoutes);
app.use("/scans", scansRoutes);

// Error handling
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
