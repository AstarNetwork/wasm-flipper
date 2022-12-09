"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _networks = require("@polkadot/networks");
var _util = require("@polkadot/util");
var allKnown = _interopRequireWildcard(require("./e2e"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Copyright 2017-2022 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

// testnets are not available in the networks map
const NET_EXTRA = {
  westend: {
    genesisHash: ['0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e']
  }
};

/** @internal */
function mapRaw(_ref) {
  let [network, versions] = _ref;
  const chain = _networks.selectableNetworks.find(n => n.network === network) || NET_EXTRA[network];
  if (!chain) {
    throw new Error(`Unable to find info for chain ${network}`);
  }
  return {
    genesisHash: (0, _util.hexToU8a)(chain.genesisHash[0]),
    network,
    versions: versions.map(_ref2 => {
      let [blockNumber, specVersion, apis] = _ref2;
      return {
        apis,
        blockNumber: new _util.BN(blockNumber),
        specVersion: new _util.BN(specVersion)
      };
    })
  };
}

// Type overrides for specific spec types & versions as given in runtimeVersion
const upgrades = Object.entries(allKnown).map(mapRaw);
var _default = upgrades;
exports.default = _default;