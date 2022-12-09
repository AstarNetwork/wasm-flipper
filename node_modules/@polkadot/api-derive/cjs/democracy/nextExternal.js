"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextExternal = nextExternal;
var _rxjs = require("rxjs");
var _util = require("../util");
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function withImage(api, nextOpt) {
  if (nextOpt.isNone) {
    return (0, _rxjs.of)(null);
  }
  const [hash, threshold] = nextOpt.unwrap();
  return api.derive.democracy.preimage(hash).pipe((0, _rxjs.map)(image => ({
    image,
    imageHash: (0, _util2.getImageHashBounded)(hash),
    threshold
  })));
}
function nextExternal(instanceId, api) {
  return (0, _util.memo)(instanceId, () => {
    var _api$query$democracy;
    return (_api$query$democracy = api.query.democracy) != null && _api$query$democracy.nextExternal ? api.query.democracy.nextExternal().pipe((0, _rxjs.switchMap)(nextOpt => withImage(api, nextOpt))) : (0, _rxjs.of)(null);
  });
}