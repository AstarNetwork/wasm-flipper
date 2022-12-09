"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @description Retrieves all the session and era query and calculates specific values on it as the length of the session and eras
 */
function info(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => api.derive.session.indexes().pipe((0, _rxjs.map)(indexes => {
    var _api$consts, _api$consts$babe, _api$consts2, _api$consts2$staking;
    const sessionLength = ((_api$consts = api.consts) == null ? void 0 : (_api$consts$babe = _api$consts.babe) == null ? void 0 : _api$consts$babe.epochDuration) || api.registry.createType('u64', 1);
    const sessionsPerEra = ((_api$consts2 = api.consts) == null ? void 0 : (_api$consts2$staking = _api$consts2.staking) == null ? void 0 : _api$consts2$staking.sessionsPerEra) || api.registry.createType('SessionIndex', 1);
    return (0, _util.objectSpread)({
      eraLength: api.registry.createType('BlockNumber', sessionsPerEra.mul(sessionLength)),
      isEpoch: !!api.query.babe,
      sessionLength,
      sessionsPerEra
    }, indexes);
  })));
}