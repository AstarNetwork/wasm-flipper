"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.referendums = referendums;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function referendums(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => api.derive.democracy.referendumsActive().pipe((0, _rxjs.switchMap)(referendums => referendums.length ? (0, _rxjs.combineLatest)([(0, _rxjs.of)(referendums), api.derive.democracy._referendumsVotes(referendums)]) : (0, _rxjs.of)([[], []])), (0, _rxjs.map)(_ref => {
    let [referendums, votes] = _ref;
    return referendums.map((referendum, index) => (0, _util.objectSpread)({}, referendum, votes[index]));
  })));
}