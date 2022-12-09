"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.v1ToV2 = v1ToV2;
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

const ARG_TYPES = {
  ContractConstructorSpec: 'ContractMessageParamSpecV2',
  ContractEventSpec: 'ContractEventParamSpecV2',
  ContractMessageSpec: 'ContractMessageParamSpecV2'
};
function v1ToV2Label(entry) {
  return (0, _util.objectSpread)({}, entry, {
    label: Array.isArray(entry.name) ? entry.name.join('::') : entry.name
  });
}
function v1ToV2Labels(registry, outType, all) {
  return all.map(e => registry.createType(`${outType}V2`, (0, _util.objectSpread)(v1ToV2Label(e), {
    args: e.args.map(a => registry.createType(ARG_TYPES[outType], v1ToV2Label(a)))
  })));
}
function v1ToV2(registry, v1) {
  return registry.createType('ContractMetadataV2', (0, _util.objectSpread)({}, v1, {
    spec: (0, _util.objectSpread)({}, v1.spec, {
      constructors: v1ToV2Labels(registry, 'ContractConstructorSpec', v1.spec.constructors),
      events: v1ToV2Labels(registry, 'ContractEventSpec', v1.spec.events),
      messages: v1ToV2Labels(registry, 'ContractMessageSpec', v1.spec.messages)
    })
  }));
}