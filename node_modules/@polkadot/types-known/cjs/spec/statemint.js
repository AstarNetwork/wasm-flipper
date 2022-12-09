"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _typesCreate = require("@polkadot/types-create");
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

const sharedTypes = {
  DispatchErrorModule: 'DispatchErrorModuleU8',
  TAssetBalance: 'u128',
  ProxyType: {
    _enum: ['Any', 'NonTransfer', 'CancelProxy', 'Assets', 'AssetOwner', 'AssetManager', 'Staking']
  },
  Weight: 'WeightV1'
};

// these are override types for Statemine, Statemint, Westmint
const versioned = [{
  minmax: [0, 3],
  types: (0, _util.objectSpread)({
    // Enum was modified mid-flight -
    // https://github.com/paritytech/substrate/pull/10382/files#diff-e4e016b33a82268b6208dc974eea841bad47597865a749fee2f937eb6fdf67b4R498
    DispatchError: 'DispatchErrorPre6First'
  }, sharedTypes, (0, _typesCreate.mapXcmTypes)('V0'))
}, {
  minmax: [4, 5],
  types: (0, _util.objectSpread)({
    // As above, see https://github.com/polkadot-js/api/issues/5301
    DispatchError: 'DispatchErrorPre6First'
  }, sharedTypes, (0, _typesCreate.mapXcmTypes)('V1'))
}, {
  // metadata V14
  minmax: [500, undefined],
  types: {
    Weight: 'WeightV1'
  }
}
// ,
// {
//   // weight v2 introduction
//   minmax: [9300, undefined],
//   types: {
//     Weight: 'WeightV2'
//   }
// }
];
var _default = versioned;
exports.default = _default;