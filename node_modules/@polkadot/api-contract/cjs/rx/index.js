"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContractRx = exports.CodeRx = exports.BlueprintRx = void 0;
var _api = require("@polkadot/api");
var _base = require("../base");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

class BlueprintRx extends _base.Blueprint {
  constructor(api, abi, codeHash) {
    super(api, abi, codeHash, _api.toRxMethod);
  }
}
exports.BlueprintRx = BlueprintRx;
class CodeRx extends _base.Code {
  constructor(api, abi, wasm) {
    super(api, abi, wasm, _api.toRxMethod);
  }
}
exports.CodeRx = CodeRx;
class ContractRx extends _base.Contract {
  constructor(api, abi, address) {
    super(api, abi, address, _api.toRxMethod);
  }
}
exports.ContractRx = ContractRx;