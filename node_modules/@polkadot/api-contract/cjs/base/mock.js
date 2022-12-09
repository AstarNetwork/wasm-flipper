"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockApi = void 0;
var _types = require("@polkadot/types");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

const registry = new _types.TypeRegistry();
const instantiateWithCode = () => {
  throw new Error('mock');
};
instantiateWithCode.meta = {
  args: new Array(6)
};
const mockApi = {
  call: {
    contractsApi: {
      call: () => {
        throw new Error('mock');
      }
    }
  },
  isConnected: true,
  registry,
  tx: {
    contracts: {
      instantiateWithCode
    }
  }
};
exports.mockApi = mockApi;