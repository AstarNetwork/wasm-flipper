"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHeader = getHeader;
var _rxjs = require("rxjs");
var _type = require("../type");
var _util = require("../util");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name getHeader
 * @param {( Uint8Array | string )} hash - A block hash as U8 array or string.
 * @returns An array containing the block header and the block author
 * @description Get a specific block header and extend it with the author
 * @example
 * <BR>
 *
 * ```javascript
 * const { author, number } = await api.derive.chain.getHeader('0x123...456');
 *
 * console.log(`block #${number} was authored by ${author}`);
 * ```
 */
function getHeader(instanceId, api) {
  return (0, _util.memo)(instanceId, blockHash => (0, _rxjs.combineLatest)([api.rpc.chain.getHeader(blockHash), api.queryAt(blockHash)]).pipe((0, _rxjs.switchMap)(_ref => {
    let [header, queryAt] = _ref;
    return (0, _util2.getAuthorDetails)(header, queryAt);
  }), (0, _rxjs.map)(_ref2 => {
    let [header, validators, author] = _ref2;
    return (0, _type.createHeaderExtended)((validators || header).registry, header, validators, author);
  })));
}