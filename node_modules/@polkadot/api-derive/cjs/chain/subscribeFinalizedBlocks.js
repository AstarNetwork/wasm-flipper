"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeFinalizedBlocks = subscribeFinalizedBlocks;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name subscribeFinalizedBlocks
 * @returns The finalized block & events for that block
 */
function subscribeFinalizedBlocks(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.derive.chain.subscribeFinalizedHeads().pipe((0, _rxjs.switchMap)(header => api.derive.chain.getBlock(header.createdAtHash || header.hash))));
}