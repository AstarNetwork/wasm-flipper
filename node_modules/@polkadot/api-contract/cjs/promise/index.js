"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContractPromise = exports.CodePromise = exports.BlueprintPromise = void 0;
var _api = require("@polkadot/api");
var _base = require("../base");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

class BlueprintPromise extends _base.Blueprint {
  constructor(api, abi, codeHash) {
    super(api, abi, codeHash, _api.toPromiseMethod);
  }
}
exports.BlueprintPromise = BlueprintPromise;
class CodePromise extends _base.Code {
  constructor(api, abi, wasm) {
    super(api, abi, wasm, _api.toPromiseMethod);
  }
}
exports.CodePromise = CodePromise;
class ContractPromise extends _base.Contract {
  constructor(api, abi, address) {
    super(api, abi, address, _api.toPromiseMethod);
  }
}
exports.ContractPromise = ContractPromise;