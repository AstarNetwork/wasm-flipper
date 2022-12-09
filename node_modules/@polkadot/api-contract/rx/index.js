// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { toRxMethod } from '@polkadot/api';
import { Blueprint, Code, Contract } from "../base/index.js";
export class BlueprintRx extends Blueprint {
  constructor(api, abi, codeHash) {
    super(api, abi, codeHash, toRxMethod);
  }
}
export class CodeRx extends Code {
  constructor(api, abi, wasm) {
    super(api, abi, wasm, toRxMethod);
  }
}
export class ContractRx extends Contract {
  constructor(api, abi, address) {
    super(api, abi, address, toRxMethod);
  }
}