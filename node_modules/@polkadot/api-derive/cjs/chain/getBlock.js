"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBlock = getBlock;
var _rxjs = require("rxjs");
var _type = require("../type");
var _util = require("../util");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name getBlock
 * @param {( Uint8Array | string )} hash - A block hash as U8 array or string.
 * @description Get a specific block (e.g. rpc.chain.getBlock) and extend it with the author
 * @example
 * <BR>
 *
 * ```javascript
 * const { author, block } = await api.derive.chain.getBlock('0x123...456');
 *
 * console.log(`block #${block.header.number} was authored by ${author}`);
 * ```
 */
function getBlock(instanceId, api) {
  return (0, _util.memo)(instanceId, blockHash => (0, _rxjs.combineLatest)([api.rpc.chain.getBlock(blockHash), api.queryAt(blockHash)]).pipe((0, _rxjs.switchMap)(_ref => {
    let [signedBlock, queryAt] = _ref;
    return (0, _rxjs.combineLatest)([(0, _rxjs.of)(signedBlock), queryAt.system.events(), (0, _util2.getAuthorDetails)(signedBlock.block.header, queryAt)]);
  }), (0, _rxjs.map)(_ref2 => {
    let [signedBlock, events, [, validators, author]] = _ref2;
    return (0, _type.createSignedBlockExtended)(events.registry, signedBlock, events, validators, author);
  })));
}