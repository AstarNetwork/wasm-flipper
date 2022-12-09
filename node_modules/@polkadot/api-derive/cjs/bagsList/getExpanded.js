"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expand = expand;
exports.getExpanded = getExpanded;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function expand(instanceId, api) {
  return (0, _util2.memo)(instanceId, bag => api.derive.bagsList.listNodes(bag.bag).pipe((0, _rxjs.map)(nodes => (0, _util.objectSpread)({
    nodes
  }, bag))));
}
function getExpanded(instanceId, api) {
  return (0, _util2.memo)(instanceId, id => api.derive.bagsList.get(id).pipe((0, _rxjs.switchMap)(bag => api.derive.bagsList.expand(bag))));
}