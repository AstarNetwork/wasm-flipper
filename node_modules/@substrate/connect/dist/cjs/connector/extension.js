"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScClient = void 0;
const types_js_1 = require("./types.js");
const index_js_1 = require("./specs/index.js");
const listeners = new Map();
if (typeof window === "object") {
    window.addEventListener("message", ({ data }) => {
        var _a;
        if ((data === null || data === void 0 ? void 0 : data.origin) !== "substrate-connect-extension")
            return;
        (_a = listeners.get(data.chainId)) === null || _a === void 0 ? void 0 : _a(data);
    });
}
function getRandomChainId() {
    const arr = new BigUint64Array(2);
    // It can only be used from the browser, so this is fine.
    crypto.getRandomValues(arr);
    const result = (arr[1] << BigInt(64)) | arr[0];
    return result.toString(36);
}
/**
 * Returns a {@link ScClient} that connects to chains by asking the substrate-connect extension
 * to do so.
 *
 * This function assumes that the extension is installed and available. It is out of scope of this
 * function to detect whether this is the case.
 * If you try to add a chain without the extension installed, nothing will happen and the
 * `Promise`s will never resolve.
 */
const createScClient = () => {
    const chains = new Map();
    const internalAddChain = (isWellKnown, chainSpecOrWellKnownName, jsonRpcCallback, potentialRelayChainIds = []) => __awaiter(void 0, void 0, void 0, function* () {
        let resolve;
        const initFinished = new Promise((res) => {
            resolve = () => res(null);
        });
        const chainState = {
            id: getRandomChainId(),
            state: {
                state: "pending",
                waitFinished: resolve,
            },
        };
        if (listeners.has(chainState.id))
            throw new Error("Unexpectedly randomly generated the same chain ID twice despite 64bits of entropy");
        // Setup the listener for this chain.
        // This listener should never be removed until we are no longer interested in this chain.
        // Removing then re-adding the listener could cause messages to be missed.
        listeners.set(chainState.id, (msg) => {
            switch (chainState.state.state) {
                case "pending": {
                    const waitFinished = chainState.state.waitFinished;
                    switch (msg.type) {
                        case "chain-ready": {
                            chainState.state = {
                                state: "ok",
                            };
                            break;
                        }
                        case "error": {
                            chainState.state = {
                                state: "dead",
                                error: new types_js_1.CrashError("Error while creating the chain: " + msg.errorMessage),
                            };
                            break;
                        }
                        default: {
                            // Unexpected message. We ignore it.
                            // While it could be tempting to switch the chain to `dead`, the extension might
                            // think that the chain is still alive, and the state mismatch could have
                            // unpredictable and confusing consequences.
                            console.warn("Unexpected message of type `msg.type` received from substrate-connect extension");
                        }
                    }
                    waitFinished();
                    break;
                }
                case "ok": {
                    switch (msg.type) {
                        case "error": {
                            chainState.state = {
                                state: "dead",
                                error: new types_js_1.CrashError("Extension has killed the chain: " + msg.errorMessage),
                            };
                            break;
                        }
                        case "rpc": {
                            if (jsonRpcCallback) {
                                jsonRpcCallback(msg.jsonRpcMessage);
                            }
                            else {
                                console.warn("Unexpected message of type `msg.type` received from substrate-connect extension");
                            }
                            break;
                        }
                        default: {
                            // Unexpected message. We ignore it.
                            // While it could be tempting to switch the chain to `dead`, the extension might
                            // think that the chain is still alive, and the state mismatch could have
                            // unpredictable and confusing consequences.
                            console.warn("Unexpected message of type `msg.type` received from substrate-connect extension");
                        }
                    }
                    break;
                }
                case "dead": {
                    // We don't expect any message anymore.
                    break;
                }
            }
        });
        // Now that everything is ready to receive messages back from the extension, send the
        // add-chain message.
        if (isWellKnown) {
            postToExtension({
                origin: "substrate-connect-client",
                chainId: chainState.id,
                type: "add-well-known-chain",
                chainName: chainSpecOrWellKnownName,
            });
        }
        else {
            postToExtension({
                origin: "substrate-connect-client",
                chainId: chainState.id,
                type: "add-chain",
                chainSpec: chainSpecOrWellKnownName,
                potentialRelayChainIds,
            });
        }
        // Wait for the extension to send back either a confirmation or an error.
        // Note that `initFinished` becomes ready when `chainState` has been modified. The outcome
        // can be known by looking into `chainState`.
        yield initFinished;
        // In the situation where we tried to create a well-known chain, the extension isn't supposed
        // to ever return an error. There is however one situation where errors can happen: if the
        // extension doesn't recognize the desired well-known chain because it uses a different list
        // of well-known chains than this code. To handle this, we download the chain spec of the
        // desired well-known chain and try again but this time as a non-well-known chain.
        if (isWellKnown && chainState.state.state === "dead") {
            // Note that we keep the same id for the chain for convenience.
            let resolve;
            const initFinished = new Promise((res) => {
                resolve = () => res(null);
            });
            chainState.state = {
                state: "pending",
                waitFinished: resolve,
            };
            postToExtension({
                origin: "substrate-connect-client",
                chainId: chainState.id,
                type: "add-chain",
                chainSpec: yield (0, index_js_1.getSpec)(chainSpecOrWellKnownName),
                potentialRelayChainIds: [],
            });
            yield initFinished;
        }
        // Now check the `chainState` to know if things have succeeded.
        if (chainState.state.state === "dead") {
            throw chainState.state.error;
        }
        // Everything is successful.
        const chain = {
            sendJsonRpc: (jsonRpcMessage) => {
                if (chainState.state.state === "dead") {
                    throw chainState.state.error;
                }
                if (!jsonRpcCallback)
                    throw new types_js_1.JsonRpcDisabledError();
                postToExtension({
                    origin: "substrate-connect-client",
                    chainId: chainState.id,
                    type: "rpc",
                    jsonRpcMessage,
                });
            },
            remove: () => {
                if (chainState.state.state === "dead") {
                    throw chainState.state.error;
                }
                chainState.state = {
                    state: "dead",
                    error: new types_js_1.AlreadyDestroyedError(),
                };
                listeners.delete(chainState.id);
                chains.delete(chain);
                postToExtension({
                    origin: "substrate-connect-client",
                    chainId: chainState.id,
                    type: "remove-chain",
                });
            },
        };
        // This mapping of chains is kept just for the `potentialRelayChainIds` field.
        chains.set(chain, chainState.id);
        return chain;
    });
    return {
        addChain: (chainSpec, jsonRpcCallback) => internalAddChain(false, chainSpec, jsonRpcCallback, [...chains.values()]),
        addWellKnownChain: (name, jsonRpcCallback) => internalAddChain(true, name, jsonRpcCallback),
    };
};
exports.createScClient = createScClient;
// Sends a message to the extension. This function primarly exists in order to provide strong
// typing for the message.
function postToExtension(msg) {
    window.postMessage(msg, "*");
}
//# sourceMappingURL=extension.js.map