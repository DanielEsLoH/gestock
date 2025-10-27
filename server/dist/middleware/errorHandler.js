"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.error("[Error Handler]:", {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });
    res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && {
            error: error.message,
            stack: error.stack,
        }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map