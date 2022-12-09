"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeSubmittableResult = exports.Code = void 0;
exports.extendCode = extendCode;
var _api = require("@polkadot/api");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _Base = require("./Base");
var _Blueprint = require("./Blueprint");
var _Contract = require("./Contract");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

class CodeSubmittableResult extends _api.SubmittableResult {
  constructor(result, blueprint, contract) {
    super(result);
    this.blueprint = blueprint;
    this.contract = contract;
  }
}
exports.CodeSubmittableResult = CodeSubmittableResult;
class Code extends _Base.Base {
  #tx = {};
  constructor(api, abi, wasm, decorateMethod) {
    super(api, abi, decorateMethod);
    this.code = (0, _util.isWasm)(this.abi.info.source.wasm) ? this.abi.info.source.wasm : (0, _util.u8aToU8a)(wasm);
    if (!(0, _util.isWasm)(this.code)) {
      throw new Error('No WASM code provided');
    }
    this.abi.constructors.forEach(c => {
      if ((0, _util.isUndefined)(this.#tx[c.method])) {
        this.#tx[c.method] = (0, _util3.createBluePrintTx)(c, (o, p) => this.#instantiate(c, o, p));
      }
    });
  }
  get tx() {
    return this.#tx;
  }
  #instantiate = (constructorOrId, _ref, params) => {
    let {
      gasLimit = _util.BN_ZERO,
      salt,
      storageDepositLimit = null,
      value = _util.BN_ZERO
    } = _ref;
    return this.api.tx.contracts.instantiateWithCode(value,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore jiggle v1 weights, metadata points to latest
    this._isWeightV1 ? (0, _util3.convertWeight)(gasLimit).v1Weight : (0, _util3.convertWeight)(gasLimit).v2Weight, storageDepositLimit, (0, _util.compactAddLength)(this.code), this.abi.findConstructor(constructorOrId).toU8a(params), (0, _util3.encodeSalt)(salt)).withResultTransform(result => new CodeSubmittableResult(result, ...((0, _util2.applyOnEvent)(result, ['CodeStored', 'Instantiated'], records => records.reduce((_ref2, _ref3) => {
      let [blueprint, contract] = _ref2;
      let {
        event
      } = _ref3;
      return this.api.events.contracts.Instantiated.is(event) ? [blueprint, new _Contract.Contract(this.api, this.abi, event.data[1], this._decorateMethod)] : this.api.events.contracts.CodeStored.is(event) ? [new _Blueprint.Blueprint(this.api, this.abi, event.data[0], this._decorateMethod), contract] : [blueprint, contract];
    }, [])) || [])));
  };
}
exports.Code = Code;
function extendCode(type, decorateMethod) {
  return class extends Code {
    static __CodeType = type;
    constructor(api, abi, wasm) {
      super(api, abi, wasm, decorateMethod);
    }
  };
}