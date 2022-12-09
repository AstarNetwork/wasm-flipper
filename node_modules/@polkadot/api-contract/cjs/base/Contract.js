"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContractSubmittableResult = exports.Contract = void 0;
exports.extendContract = extendContract;
var _rxjs = require("rxjs");
var _api = require("@polkadot/api");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _Base = require("./Base");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

// As per Rust, 5 * GAS_PER_SEC
const MAX_CALL_GAS = new _util.BN(5000000000000).isub(_util.BN_ONE);
const l = (0, _util.logger)('Contract');
function createQuery(meta, fn) {
  return (0, _util3.withMeta)(meta, function (origin, options) {
    for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }
    return fn(origin, options, params);
  });
}
function createTx(meta, fn) {
  return (0, _util3.withMeta)(meta, function (options) {
    for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      params[_key2 - 1] = arguments[_key2];
    }
    return fn(options, params);
  });
}
class ContractSubmittableResult extends _api.SubmittableResult {
  constructor(result, contractEvents) {
    super(result);
    this.contractEvents = contractEvents;
  }
}
exports.ContractSubmittableResult = ContractSubmittableResult;
class Contract extends _Base.Base {
  /**
   * @description The on-chain address for this contract
   */

  #query = {};
  #tx = {};
  constructor(api, abi, address, decorateMethod) {
    super(api, abi, decorateMethod);
    this.address = this.registry.createType('AccountId', address);
    this.abi.messages.forEach(m => {
      if ((0, _util.isUndefined)(this.#tx[m.method])) {
        this.#tx[m.method] = createTx(m, (o, p) => this.#exec(m, o, p));
      }
      if ((0, _util.isUndefined)(this.#query[m.method])) {
        this.#query[m.method] = createQuery(m, (f, o, p) => this.#read(m, o, p).send(f));
      }
    });
  }
  get query() {
    return this.#query;
  }
  get tx() {
    return this.#tx;
  }
  #getGas = (() => {
    var _this = this;
    return function (_gasLimit) {
      let isCall = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const weight = (0, _util3.convertWeight)(_gasLimit);
      if (weight.v1Weight.gt(_util.BN_ZERO)) {
        return weight;
      }
      return (0, _util3.convertWeight)(isCall ? MAX_CALL_GAS : (0, _util3.convertWeight)(_this.api.consts.system.blockWeights ? _this.api.consts.system.blockWeights.maxBlock : _this.api.consts.system.maximumBlockWeight).v1Weight.muln(64).div(_util.BN_HUNDRED));
    };
  })();
  #exec = (messageOrId, _ref, params) => {
    let {
      gasLimit = _util.BN_ZERO,
      storageDepositLimit = null,
      value = _util.BN_ZERO
    } = _ref;
    return this.api.tx.contracts.call(this.address, value,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore jiggle v1 weights, metadata points to latest
    this._isWeightV1 ? (0, _util3.convertWeight)(gasLimit).v1Weight : (0, _util3.convertWeight)(gasLimit).v2Weight, storageDepositLimit, this.abi.findMessage(messageOrId).toU8a(params)).withResultTransform(result =>
    // ContractEmitted is the current generation, ContractExecution is the previous generation
    new ContractSubmittableResult(result, (0, _util2.applyOnEvent)(result, ['ContractEmitted', 'ContractExecution'], records => records.map(_ref2 => {
      let {
        event: {
          data: [, data]
        }
      } = _ref2;
      try {
        return this.abi.decodeEvent(data);
      } catch (error) {
        l.error(`Unable to decode contract event: ${error.message}`);
        return null;
      }
    }).filter(decoded => !!decoded))));
  };
  #read = (messageOrId, _ref3, params) => {
    let {
      gasLimit = _util.BN_ZERO,
      storageDepositLimit = null,
      value = _util.BN_ZERO
    } = _ref3;
    const message = this.abi.findMessage(messageOrId);
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      send: this._decorateMethod(origin => this.api.rx.call.contractsApi.call(origin, this.address, value,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore jiggle v1 weights, metadata points to latest
      this._isWeightV1 ? this.#getGas(gasLimit, true).v1Weight : this.#getGas(gasLimit, true).v2Weight, storageDepositLimit, message.toU8a(params)).pipe((0, _rxjs.map)(_ref4 => {
        let {
          debugMessage,
          gasConsumed,
          gasRequired,
          result,
          storageDeposit
        } = _ref4;
        return {
          debugMessage,
          gasConsumed,
          gasRequired: gasRequired && !(0, _util3.convertWeight)(gasRequired).v1Weight.isZero() ? gasRequired : gasConsumed,
          output: result.isOk && message.returnType ? this.abi.registry.createTypeUnsafe(message.returnType.lookupName || message.returnType.type, [result.asOk.data.toU8a(true)], {
            isPedantic: true
          }) : null,
          result,
          storageDeposit
        };
      })))
    };
  };
}
exports.Contract = Contract;
function extendContract(type, decorateMethod) {
  return class extends Contract {
    static __ContractType = type;
    constructor(api, abi, address) {
      super(api, abi, address, decorateMethod);
    }
  };
}