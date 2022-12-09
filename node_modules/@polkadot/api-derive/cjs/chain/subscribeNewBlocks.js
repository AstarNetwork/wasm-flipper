"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeNewBlocks = subscribeNewBlocks;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name subscribeNewBlocks
 * @returns The latest block & events for that block
 */
function subscribeNewBlocks(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.derive.chain.subscribeNewHeads().pipe((0, _rxjs.switchMap)(header => api.derive.chain.getBlock(header.createdAtHash || header.hash))));
}