"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_SALT = void 0;
exports.convertWeight = convertWeight;
exports.createBluePrintTx = createBluePrintTx;
exports.createBluePrintWithId = createBluePrintWithId;
exports.encodeSalt = encodeSalt;
exports.isWeightV2 = isWeightV2;
exports.withMeta = withMeta;
var _types = require("@polkadot/types");
var _util = require("@polkadot/util");
var _utilCrypto = require("@polkadot/util-crypto");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

const EMPTY_SALT = new Uint8Array();
exports.EMPTY_SALT = EMPTY_SALT;
function withMeta(meta, creator) {
  creator.meta = meta;
  return creator;
}
function createBluePrintTx(meta, fn) {
  return withMeta(meta, function (options) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }
    return fn(options, params);
  });
}
function createBluePrintWithId(fn) {
  return function (constructorOrId, options) {
    for (var _len2 = arguments.length, params = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      params[_key2 - 2] = arguments[_key2];
    }
    return fn(constructorOrId, options, params);
  };
}
function encodeSalt() {
  let salt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utilCrypto.randomAsU8a)();
  return salt instanceof _types.Bytes ? salt : salt && salt.length ? (0, _util.compactAddLength)((0, _util.u8aToU8a)(salt)) : EMPTY_SALT;
}
function convertWeight(weight) {
  const [refTime, proofSize] = isWeightV2(weight) ? [weight.refTime.toBn(), weight.proofSize.toBn()] : [(0, _util.bnToBn)(weight), undefined];
  return {
    v1Weight: refTime,
    v2Weight: {
      proofSize,
      refTime
    }
  };
}
function isWeightV2(weight) {
  return !!weight.proofSize;
}