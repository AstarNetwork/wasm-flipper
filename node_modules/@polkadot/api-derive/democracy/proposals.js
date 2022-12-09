// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { isFunction, objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
import { getImageHashBounded } from "./util.js";
function isNewDepositors(depositors) {
  // Detect balance...
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return isFunction(depositors[1].mul);
}
function parse([proposals, images, optDepositors]) {
  return proposals.filter(([,, proposer], index) => {
    var _optDepositors$index;
    return !!((_optDepositors$index = optDepositors[index]) != null && _optDepositors$index.isSome) && !proposer.isEmpty;
  }).map(([index, hash, proposer], proposalIndex) => {
    const depositors = optDepositors[proposalIndex].unwrap();
    return objectSpread({
      image: images[proposalIndex],
      imageHash: getImageHashBounded(hash),
      index,
      proposer
    }, isNewDepositors(depositors) ? {
      balance: depositors[1],
      seconds: depositors[0]
    } : {
      balance: depositors[0],
      seconds: depositors[1]
    });
  });
}
export function proposals(instanceId, api) {
  return memo(instanceId, () => {
    var _api$query$democracy, _api$query$democracy2;
    return isFunction((_api$query$democracy = api.query.democracy) == null ? void 0 : _api$query$democracy.publicProps) && isFunction((_api$query$democracy2 = api.query.democracy) == null ? void 0 : _api$query$democracy2.preimages) ? api.query.democracy.publicProps().pipe(switchMap(proposals => proposals.length ? combineLatest([of(proposals), api.derive.democracy.preimages(proposals.map(([, hash]) => hash)), api.query.democracy.depositOf.multi(proposals.map(([index]) => index))]) : of([[], [], []])), map(parse)) : of([]);
  });
}