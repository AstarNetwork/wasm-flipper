"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScClient = exports.isExtensionPresent = void 0;
const smoldot_light_js_1 = require("./smoldot-light.js");
const extension_js_1 = require("./extension.js");
const connect_extension_protocol_1 = require("@substrate/connect-extension-protocol");
__exportStar(require("./types.js"), exports);
/**
 * `true` if the substrate-connect extension is installed and available.
 *
 * Always `false` when outside of a browser environment.
 *
 * We detect this based on the presence of a DOM element with a specific `id`. See
 * `connect-extension-protocol`.
 *
 * Note that the value is determined at initialization and will not change even if the user
 * enables, disables, installs, or uninstalls the extension while the script is running. These
 * situations are very niche, and handling them properly would add a lot of complexity that isn't
 * worth it.
 *
 * This constant is mostly for informative purposes, for example to display a message in a UI
 * encouraging the user to install the extension.
 */
exports.isExtensionPresent = typeof document === "object" &&
    typeof document.getElementById === "function" &&
    !!document.getElementById(connect_extension_protocol_1.DOM_ELEMENT_ID);
/**
 * Returns a {@link ScClient} that connects to chains, either through the substrate-connect
 * extension or by executing a light client directly from JavaScript, depending on whether the
 * extension is installed and available.
 */
function createScClient(config) {
    const forceEmbedded = config === null || config === void 0 ? void 0 : config.forceEmbeddedNode;
    if (!forceEmbedded && exports.isExtensionPresent)
        return (0, extension_js_1.createScClient)();
    return (0, smoldot_light_js_1.createScClient)(config === null || config === void 0 ? void 0 : config.embeddedNodeConfig);
}
exports.createScClient = createScClient;
//# sourceMappingURL=index.js.map