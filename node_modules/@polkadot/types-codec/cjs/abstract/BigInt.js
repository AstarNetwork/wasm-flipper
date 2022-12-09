"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractBigInt = void 0;
var _xBigint = require("@polkadot/x-bigint");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

// @ts-expect-error not extensible, we make it extensible here
class AbstractBigInt extends _xBigint.BigInt {
  // @ts-expect-error super() not required, the self magic does that
  constructor(value) {
    const self = Object((0, _xBigint.BigInt)(value));
    Object.setPrototypeOf(self, AbstractBigInt.prototype);
    return self;
  }
}
exports.AbstractBigInt = AbstractBigInt;