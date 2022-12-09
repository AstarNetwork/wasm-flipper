"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpecAlias = getSpecAlias;
exports.getSpecExtensions = getSpecExtensions;
exports.getSpecHasher = getSpecHasher;
exports.getSpecRpc = getSpecRpc;
exports.getSpecRuntime = getSpecRuntime;
exports.getSpecTypes = getSpecTypes;
exports.getUpgradeVersion = getUpgradeVersion;
var _util = require("@polkadot/util");
var _chain = _interopRequireDefault(require("./chain"));
var _spec = _interopRequireDefault(require("./spec"));
var _upgrades = _interopRequireDefault(require("./upgrades"));
// Copyright 2017-2022 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @description Perform the callback function using the stringified spec/chain
 * @internal
 * */
function withNames(chainName, specName, fn) {
  return fn(chainName.toString(), specName.toString());
}

/**
 * @descriptionFflatten a VersionedType[] into a Record<string, string>
 * @internal
 * */
function filterVersions() {
  let versions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let specVersion = arguments.length > 1 ? arguments[1] : undefined;
  return versions.filter(_ref => {
    let {
      minmax: [min, max]
    } = _ref;
    return (min === undefined || min === null || specVersion >= min) && (max === undefined || max === null || specVersion <= max);
  }).reduce((result, _ref2) => {
    let {
      types
    } = _ref2;
    return (0, _util.objectSpread)(result, types);
  }, {});
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable signed extensions (ready for registration)
 */
function getSpecExtensions(_ref3, chainName, specName) {
  let {
    knownTypes
  } = _ref3;
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund, _knownTypes$typesBund2, _knownTypes$typesBund3, _knownTypes$typesBund4, _knownTypes$typesBund5, _knownTypes$typesBund6;
    return (0, _util.objectSpread)({}, (_knownTypes$typesBund = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund2 = _knownTypes$typesBund.spec) == null ? void 0 : (_knownTypes$typesBund3 = _knownTypes$typesBund2[s]) == null ? void 0 : _knownTypes$typesBund3.signedExtensions, (_knownTypes$typesBund4 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund5 = _knownTypes$typesBund4.chain) == null ? void 0 : (_knownTypes$typesBund6 = _knownTypes$typesBund5[c]) == null ? void 0 : _knownTypes$typesBund6.signedExtensions);
  });
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable types (ready for registration)
 */
function getSpecTypes(_ref4, chainName, specName, specVersion) {
  let {
    knownTypes
  } = _ref4;
  const _specVersion = (0, _util.bnToBn)(specVersion).toNumber();
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund7, _knownTypes$typesBund8, _knownTypes$typesBund9, _knownTypes$typesBund10, _knownTypes$typesBund11, _knownTypes$typesBund12, _knownTypes$typesSpec, _knownTypes$typesChai;
    return (
      // The order here is always, based on -
      //   - spec then chain
      //   - typesBundle takes higher precedence
      //   - types is the final catch-all override
      (0, _util.objectSpread)({}, filterVersions(_spec.default[s], _specVersion), filterVersions(_chain.default[c], _specVersion), filterVersions((_knownTypes$typesBund7 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund8 = _knownTypes$typesBund7.spec) == null ? void 0 : (_knownTypes$typesBund9 = _knownTypes$typesBund8[s]) == null ? void 0 : _knownTypes$typesBund9.types, _specVersion), filterVersions((_knownTypes$typesBund10 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund11 = _knownTypes$typesBund10.chain) == null ? void 0 : (_knownTypes$typesBund12 = _knownTypes$typesBund11[c]) == null ? void 0 : _knownTypes$typesBund12.types, _specVersion), (_knownTypes$typesSpec = knownTypes.typesSpec) == null ? void 0 : _knownTypes$typesSpec[s], (_knownTypes$typesChai = knownTypes.typesChain) == null ? void 0 : _knownTypes$typesChai[c], knownTypes.types)
    );
  });
}

/**
 * @description Based on the chain or spec, return the hasher used
 */
function getSpecHasher(_ref5, chainName, specName) {
  let {
    knownTypes
  } = _ref5;
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund13, _knownTypes$typesBund14, _knownTypes$typesBund15, _knownTypes$typesBund16, _knownTypes$typesBund17, _knownTypes$typesBund18;
    return knownTypes.hasher || ((_knownTypes$typesBund13 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund14 = _knownTypes$typesBund13.chain) == null ? void 0 : (_knownTypes$typesBund15 = _knownTypes$typesBund14[c]) == null ? void 0 : _knownTypes$typesBund15.hasher) || ((_knownTypes$typesBund16 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund17 = _knownTypes$typesBund16.spec) == null ? void 0 : (_knownTypes$typesBund18 = _knownTypes$typesBund17[s]) == null ? void 0 : _knownTypes$typesBund18.hasher) || null;
  });
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable rpc definitions (ready for registration)
 */
function getSpecRpc(_ref6, chainName, specName) {
  let {
    knownTypes
  } = _ref6;
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund19, _knownTypes$typesBund20, _knownTypes$typesBund21, _knownTypes$typesBund22, _knownTypes$typesBund23, _knownTypes$typesBund24;
    return (0, _util.objectSpread)({}, (_knownTypes$typesBund19 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund20 = _knownTypes$typesBund19.spec) == null ? void 0 : (_knownTypes$typesBund21 = _knownTypes$typesBund20[s]) == null ? void 0 : _knownTypes$typesBund21.rpc, (_knownTypes$typesBund22 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund23 = _knownTypes$typesBund22.chain) == null ? void 0 : (_knownTypes$typesBund24 = _knownTypes$typesBund23[c]) == null ? void 0 : _knownTypes$typesBund24.rpc);
  });
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable runtime definitions (ready for registration)
 */
function getSpecRuntime(_ref7, chainName, specName) {
  let {
    knownTypes
  } = _ref7;
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund25, _knownTypes$typesBund26, _knownTypes$typesBund27, _knownTypes$typesBund28, _knownTypes$typesBund29, _knownTypes$typesBund30;
    return (0, _util.objectSpread)({}, (_knownTypes$typesBund25 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund26 = _knownTypes$typesBund25.spec) == null ? void 0 : (_knownTypes$typesBund27 = _knownTypes$typesBund26[s]) == null ? void 0 : _knownTypes$typesBund27.runtime, (_knownTypes$typesBund28 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund29 = _knownTypes$typesBund28.chain) == null ? void 0 : (_knownTypes$typesBund30 = _knownTypes$typesBund29[c]) == null ? void 0 : _knownTypes$typesBund30.runtime);
  });
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable alias definitions (ready for registration)
 */
function getSpecAlias(_ref8, chainName, specName) {
  let {
    knownTypes
  } = _ref8;
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund31, _knownTypes$typesBund32, _knownTypes$typesBund33, _knownTypes$typesBund34, _knownTypes$typesBund35, _knownTypes$typesBund36;
    return (
      // as per versions, first spec, then chain then finally non-versioned
      (0, _util.objectSpread)({}, (_knownTypes$typesBund31 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund32 = _knownTypes$typesBund31.spec) == null ? void 0 : (_knownTypes$typesBund33 = _knownTypes$typesBund32[s]) == null ? void 0 : _knownTypes$typesBund33.alias, (_knownTypes$typesBund34 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund35 = _knownTypes$typesBund34.chain) == null ? void 0 : (_knownTypes$typesBund36 = _knownTypes$typesBund35[c]) == null ? void 0 : _knownTypes$typesBund36.alias, knownTypes.typesAlias)
    );
  });
}

/**
 * @description Returns a version record for known chains where upgrades are being tracked
 */
function getUpgradeVersion(genesisHash, blockNumber) {
  const known = _upgrades.default.find(u => genesisHash.eq(u.genesisHash));
  return known ? [known.versions.reduce((last, version) => {
    return blockNumber.gt(version.blockNumber) ? version : last;
  }, undefined), known.versions.find(version => blockNumber.lte(version.blockNumber))] : [undefined, undefined];
}