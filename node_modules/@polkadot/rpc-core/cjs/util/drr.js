"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drr = drr;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _refCountDelay = require("./refCountDelay");
// Copyright 2017-2022 @polkadot/rpc-core authors & contributors
// SPDX-License-Identifier: Apache-2.0

function CMP(a, b) {
  return (0, _util.stringify)({
    t: a
  }) === (0, _util.stringify)({
    t: b
  });
}
function ERR(error) {
  throw error;
}
function NOOP() {
  // empty
}

/**
 * Shorthand for distinctUntilChanged(), publishReplay(1) and refCount().
 *
 * @ignore
 * @internal
 */
function drr() {
  let {
    delay,
    skipChange = false,
    skipTimeout = false
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return source$ => source$.pipe((0, _rxjs.catchError)(ERR), skipChange ? (0, _rxjs.tap)(NOOP) : (0, _rxjs.distinctUntilChanged)(CMP), (0, _rxjs.publishReplay)(1), skipTimeout ? (0, _rxjs.refCount)() : (0, _refCountDelay.refCountDelay)(delay));
}