"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcDisabledError = exports.CrashError = exports.AlreadyDestroyedError = void 0;
class AlreadyDestroyedError extends Error {
    constructor() {
        super();
        this.name = "AlreadyDestroyedError";
    }
}
exports.AlreadyDestroyedError = AlreadyDestroyedError;
class CrashError extends Error {
    constructor(message) {
        super(message);
        this.name = "CrashError";
    }
}
exports.CrashError = CrashError;
class JsonRpcDisabledError extends Error {
    constructor() {
        super();
        this.name = "JsonRpcDisabledError";
    }
}
exports.JsonRpcDisabledError = JsonRpcDisabledError;
//# sourceMappingURL=types.js.map