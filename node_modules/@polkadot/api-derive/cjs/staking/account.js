"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.account = void 0;
exports.accounts = accounts;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const QUERY_OPTS = {
  withDestination: true,
  withLedger: true,
  withNominations: true,
  withPrefs: true
};
function groupByEra(list) {
  return list.reduce((map, _ref) => {
    let {
      era,
      value
    } = _ref;
    const key = era.toString();
    map[key] = (map[key] || _util.BN_ZERO).add(value.unwrap());
    return map;
  }, {});
}
function calculateUnlocking(api, stakingLedger, sessionInfo) {
  const results = Object.entries(groupByEra(((stakingLedger == null ? void 0 : stakingLedger.unlocking) || []).filter(_ref2 => {
    let {
      era
    } = _ref2;
    return era.unwrap().gt(sessionInfo.activeEra);
  }))).map(_ref3 => {
    let [eraString, value] = _ref3;
    return {
      remainingEras: new _util.BN(eraString).isub(sessionInfo.activeEra),
      value: api.registry.createType('Balance', value)
    };
  });
  return results.length ? results : undefined;
}
function redeemableSum(api, stakingLedger, sessionInfo) {
  return api.registry.createType('Balance', ((stakingLedger == null ? void 0 : stakingLedger.unlocking) || []).reduce((total, _ref4) => {
    let {
      era,
      value
    } = _ref4;
    // aligns with https://github.com/paritytech/substrate/blob/fdfdc73f9e64dc47934b72eb9af3e1989e4ba699/frame/staking/src/pallet/mod.rs#L973-L975
    // (ensure currentEra >= era passed, as per https://github.com/paritytech/substrate/blob/fdfdc73f9e64dc47934b72eb9af3e1989e4ba699/frame/staking/src/lib.rs#L477-L494)
    // NOTE: Previously we used activeEra >= era, which is incorrect for the last session
    return era.unwrap().gt(sessionInfo.currentEra) ? total : total.iadd(value.unwrap());
  }, new _util.BN(0)));
}
function parseResult(api, sessionInfo, keys, query) {
  return (0, _util.objectSpread)({}, keys, query, {
    redeemable: redeemableSum(api, query.stakingLedger, sessionInfo),
    unlocking: calculateUnlocking(api, query.stakingLedger, sessionInfo)
  });
}

/**
 * @description From a list of stashes, fill in all the relevant staking details
 */
function accounts(instanceId, api) {
  return (0, _util2.memo)(instanceId, function (accountIds) {
    let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : QUERY_OPTS;
    return api.derive.session.info().pipe((0, _rxjs.switchMap)(sessionInfo => (0, _rxjs.combineLatest)([api.derive.staking.keysMulti(accountIds), api.derive.staking.queryMulti(accountIds, opts)]).pipe((0, _rxjs.map)(_ref5 => {
      let [keys, queries] = _ref5;
      return queries.map((q, index) => parseResult(api, sessionInfo, keys[index], q));
    }))));
  });
}

/**
 * @description From a stash, retrieve the controllerId and fill in all the relevant staking details
 */
const account = (0, _util2.firstMemo)((api, accountId, opts) => api.derive.staking.accounts([accountId], opts));
exports.account = account;