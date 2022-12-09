"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unwrapBlockNumber = unwrapBlockNumber;
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function unwrapBlockNumber(hdr) {
  return (0, _util.isCompact)(hdr.number) ? hdr.number.unwrap() : hdr.number;
}