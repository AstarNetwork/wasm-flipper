"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBlockNumberDerive = createBlockNumberDerive;
exports.getAuthorDetails = getAuthorDetails;
var _rxjs = require("rxjs");
var _util = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function createBlockNumberDerive(fn) {
  return (instanceId, api) => (0, _util.memo)(instanceId, () => fn(api).pipe((0, _rxjs.map)(_util.unwrapBlockNumber)));
}
function getAuthorDetails(header, queryAt) {
  // this is Moonbeam specific
  if (queryAt.authorMapping && queryAt.authorMapping.mappingWithDeposit) {
    const mapId = header.digest.logs[0] && (header.digest.logs[0].isConsensus && header.digest.logs[0].asConsensus[1] || header.digest.logs[0].isPreRuntime && header.digest.logs[0].asPreRuntime[1]);
    if (mapId) {
      return (0, _rxjs.combineLatest)([(0, _rxjs.of)(header), queryAt.session ? queryAt.session.validators() : (0, _rxjs.of)(null), queryAt.authorMapping.mappingWithDeposit(mapId).pipe((0, _rxjs.map)(opt => opt.unwrapOr({
        account: null
      }).account))]);
    }
  }

  // normal operation, non-mapping
  return (0, _rxjs.combineLatest)([(0, _rxjs.of)(header), queryAt.session ? queryAt.session.validators() : (0, _rxjs.of)(null), (0, _rxjs.of)(null)]);
}