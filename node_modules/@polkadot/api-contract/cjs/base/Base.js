"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Base = void 0;
var _util = require("@polkadot/util");
var _Abi = require("../Abi");
// Copyright 2017-2022 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

class Base {
  constructor(api, abi, decorateMethod) {
    if (!api || !api.isConnected || !api.tx) {
      throw new Error('Your API has not been initialized correctly and is not connected to a chain');
    } else if (!api.tx.contracts || !(0, _util.isFunction)(api.tx.contracts.instantiateWithCode) || api.tx.contracts.instantiateWithCode.meta.args.length !== 6) {
      throw new Error('The runtime does not expose api.tx.contracts.instantiateWithCode with storageDepositLimit');
    } else if (!api.call.contractsApi || !(0, _util.isFunction)(api.call.contractsApi.call)) {
      throw new Error('Your runtime does not expose the api.call.contractsApi.call runtime interfaces');
    }
    this.abi = abi instanceof _Abi.Abi ? abi : new _Abi.Abi(abi, api.registry.getChainProperties());
    this.api = api;
    this._decorateMethod = decorateMethod;
    this._isWeightV1 = !api.registry.createType('Weight').proofSize;
  }
  get registry() {
    return this.api.registry;
  }
}
exports.Base = Base;