"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getIds = _getIds;
exports.all = all;
exports.get = get;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
var _util2 = require("../util");
var _util3 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function orderBags(ids, bags) {
  const sorted = ids.map((id, index) => ({
    bag: bags[index].unwrapOr(null),
    id,
    key: id.toString()
  })).sort((a, b) => b.id.cmp(a.id));
  const max = sorted.length - 1;
  return sorted.map((entry, index) => (0, _util.objectSpread)(entry, {
    bagLower: index === max ? _util.BN_ZERO : sorted[index + 1].id,
    bagUpper: entry.id,
    index
  }));
}
function _getIds(instanceId, api) {
  const query = (0, _util3.getQueryInterface)(api);
  return (0, _util2.memo)(instanceId, _ids => {
    const ids = _ids.map(id => (0, _util.bnToBn)(id));
    return ids.length ? query.listBags.multi(ids).pipe((0, _rxjs.map)(bags => orderBags(ids, bags))) : (0, _rxjs.of)([]);
  });
}
function all(instanceId, api) {
  const query = (0, _util3.getQueryInterface)(api);
  return (0, _util2.memo)(instanceId, () => query.listBags.keys().pipe((0, _rxjs.switchMap)(keys => api.derive.bagsList._getIds(keys.map(_ref => {
    let {
      args: [id]
    } = _ref;
    return id;
  }))), (0, _rxjs.map)(list => list.filter(_ref2 => {
    let {
      bag
    } = _ref2;
    return bag;
  }))));
}
function get(instanceId, api) {
  return (0, _util2.memo)(instanceId, id => api.derive.bagsList._getIds([(0, _util.bnToBn)(id)]).pipe((0, _rxjs.map)(bags => bags[0])));
}