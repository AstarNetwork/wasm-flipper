"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.v2ToV3 = v2ToV3;
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

function v2ToV3(registry, v2) {
  return registry.createType('ContractMetadataV3', (0, _util.objectSpread)({}, v2, {
    spec: (0, _util.objectSpread)({}, v2.spec, {
      constructors: v2.spec.constructors.map(c =>
      // V3 introduces the payable flag on constructors, for <V3, it is always true
      registry.createType('ContractConstructorSpecV3', (0, _util.objectSpread)({}, c, {
        payable: true
      })))
    })
  }));
}