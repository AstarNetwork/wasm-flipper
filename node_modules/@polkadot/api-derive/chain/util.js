// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of } from 'rxjs';
import { memo, unwrapBlockNumber } from "../util/index.js";

// re-export these - since these needs to be resolvable from api-derive, i.e. without this
// we would emit code with ../<somewhere>/src embedded in the *.d.ts files

export function createBlockNumberDerive(fn) {
  return (instanceId, api) => memo(instanceId, () => fn(api).pipe(map(unwrapBlockNumber)));
}
export function getAuthorDetails(header, queryAt) {
  // this is Moonbeam specific
  if (queryAt.authorMapping && queryAt.authorMapping.mappingWithDeposit) {
    const mapId = header.digest.logs[0] && (header.digest.logs[0].isConsensus && header.digest.logs[0].asConsensus[1] || header.digest.logs[0].isPreRuntime && header.digest.logs[0].asPreRuntime[1]);
    if (mapId) {
      return combineLatest([of(header), queryAt.session ? queryAt.session.validators() : of(null), queryAt.authorMapping.mappingWithDeposit(mapId).pipe(map(opt => opt.unwrapOr({
        account: null
      }).account))]);
    }
  }

  // normal operation, non-mapping
  return combineLatest([of(header), queryAt.session ? queryAt.session.validators() : of(null), of(null)]);
}