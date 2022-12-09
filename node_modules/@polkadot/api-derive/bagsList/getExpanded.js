// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { map, switchMap } from 'rxjs';
import { objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
export function expand(instanceId, api) {
  return memo(instanceId, bag => api.derive.bagsList.listNodes(bag.bag).pipe(map(nodes => objectSpread({
    nodes
  }, bag))));
}
export function getExpanded(instanceId, api) {
  return memo(instanceId, id => api.derive.bagsList.get(id).pipe(switchMap(bag => api.derive.bagsList.expand(bag))));
}