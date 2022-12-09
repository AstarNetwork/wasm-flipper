"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getHeaderRange = _getHeaderRange;
exports.subscribeFinalizedHeads = subscribeFinalizedHeads;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Returns a header range from startHash to to (not including) endHash, i.e. lastBlock.parentHash === endHash
 */
function _getHeaderRange(instanceId, api) {
  return (0, _util.memo)(instanceId, function (startHash, endHash) {
    let prev = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return api.rpc.chain.getHeader(startHash).pipe((0, _rxjs.switchMap)(header => header.parentHash.eq(endHash) ? (0, _rxjs.of)([header, ...prev]) : api.derive.chain._getHeaderRange(header.parentHash, endHash, [header, ...prev])));
  });
}

/**
 * @name subscribeFinalizedHeads
 * @description An observable of the finalized block headers. Unlike the base
 * chain.subscribeFinalizedHeads this does not skip any headers. Since finalization
 * may skip specific blocks (finalization happens in terms of chains), this version
 * of the derive tracks missing headers (since last  retrieved) and provides them
 * to the caller
 */
function subscribeFinalizedHeads(instanceId, api) {
  return (0, _util.memo)(instanceId, () => {
    let prevHash = null;
    return api.rpc.chain.subscribeFinalizedHeads().pipe((0, _rxjs.switchMap)(header => {
      const endHash = prevHash;
      const startHash = header.parentHash;
      prevHash = header.createdAtHash = header.hash;
      return endHash === null || startHash.eq(endHash) ? (0, _rxjs.of)(header) : api.derive.chain._getHeaderRange(startHash, endHash, [header]).pipe((0, _rxjs.switchMap)(headers => (0, _rxjs.from)(headers)));
    }));
  });
}