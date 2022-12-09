"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overview = overview;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @description Retrieve the staking overview, including elected and points earned
 */
function overview(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => (0, _rxjs.combineLatest)([api.derive.session.indexes(), api.derive.staking.validators()]).pipe((0, _rxjs.map)(_ref => {
    let [indexes, {
      nextElected,
      validators
    }] = _ref;
    return (0, _util.objectSpread)({}, indexes, {
      nextElected,
      validators
    });
  })));
}