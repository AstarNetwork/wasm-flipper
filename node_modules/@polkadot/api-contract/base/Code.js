// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableResult } from '@polkadot/api';
import { BN_ZERO, compactAddLength, isUndefined, isWasm, u8aToU8a } from '@polkadot/util';
import { applyOnEvent } from "../util.js";
import { Base } from "./Base.js";
import { Blueprint } from "./Blueprint.js";
import { Contract } from "./Contract.js";
import { convertWeight, createBluePrintTx, encodeSalt } from "./util.js";
export class CodeSubmittableResult extends SubmittableResult {
  constructor(result, blueprint, contract) {
    super(result);
    this.blueprint = blueprint;
    this.contract = contract;
  }
}
export class Code extends Base {
  #tx = {};
  constructor(api, abi, wasm, decorateMethod) {
    super(api, abi, decorateMethod);
    this.code = isWasm(this.abi.info.source.wasm) ? this.abi.info.source.wasm : u8aToU8a(wasm);
    if (!isWasm(this.code)) {
      throw new Error('No WASM code provided');
    }
    this.abi.constructors.forEach(c => {
      if (isUndefined(this.#tx[c.method])) {
        this.#tx[c.method] = createBluePrintTx(c, (o, p) => this.#instantiate(c, o, p));
      }
    });
  }
  get tx() {
    return this.#tx;
  }
  #instantiate = (constructorOrId, {
    gasLimit = BN_ZERO,
    salt,
    storageDepositLimit = null,
    value = BN_ZERO
  }, params) => {
    return this.api.tx.contracts.instantiateWithCode(value,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore jiggle v1 weights, metadata points to latest
    this._isWeightV1 ? convertWeight(gasLimit).v1Weight : convertWeight(gasLimit).v2Weight, storageDepositLimit, compactAddLength(this.code), this.abi.findConstructor(constructorOrId).toU8a(params), encodeSalt(salt)).withResultTransform(result => new CodeSubmittableResult(result, ...(applyOnEvent(result, ['CodeStored', 'Instantiated'], records => records.reduce(([blueprint, contract], {
      event
    }) => this.api.events.contracts.Instantiated.is(event) ? [blueprint, new Contract(this.api, this.abi, event.data[1], this._decorateMethod)] : this.api.events.contracts.CodeStored.is(event) ? [new Blueprint(this.api, this.abi, event.data[0], this._decorateMethod), contract] : [blueprint, contract], [])) || [])));
  };
}
export function extendCode(type, decorateMethod) {
  return class extends Code {
    static __CodeType = type;
    constructor(api, abi, wasm) {
      super(api, abi, wasm, decorateMethod);
    }
  };
}