"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.v0ToV1 = v0ToV1;
var _types = require("@polkadot/types");
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

function v0ToV1Names(all) {
  return all.map(e => (0, _util.objectSpread)({}, e, {
    name: Array.isArray(e.name) ? e.name : [e.name]
  }));
}
function v0ToV1(registry, v0) {
  if (!v0.metadataVersion.length) {
    throw new Error('Invalid format for V0 (detected) contract metadata');
  }
  return registry.createType('ContractMetadataV1', (0, _util.objectSpread)({}, v0, {
    spec: (0, _util.objectSpread)({}, v0.spec, {
      constructors: v0ToV1Names(v0.spec.constructors),
      messages: v0ToV1Names(v0.spec.messages)
    }),
    types: (0, _types.convertSiV0toV1)(registry, v0.types)
  }));
}