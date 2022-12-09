// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { map } from 'rxjs';
import { objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";

/**
 * @description Retrieves all the session and era query and calculates specific values on it as the length of the session and eras
 */
export function info(instanceId, api) {
  return memo(instanceId, () => api.derive.session.indexes().pipe(map(indexes => {
    var _api$consts, _api$consts$babe, _api$consts2, _api$consts2$staking;
    const sessionLength = ((_api$consts = api.consts) == null ? void 0 : (_api$consts$babe = _api$consts.babe) == null ? void 0 : _api$consts$babe.epochDuration) || api.registry.createType('u64', 1);
    const sessionsPerEra = ((_api$consts2 = api.consts) == null ? void 0 : (_api$consts2$staking = _api$consts2.staking) == null ? void 0 : _api$consts2$staking.sessionsPerEra) || api.registry.createType('SessionIndex', 1);
    return objectSpread({
      eraLength: api.registry.createType('BlockNumber', sessionsPerEra.mul(sessionLength)),
      isEpoch: !!api.query.babe,
      sessionLength,
      sessionsPerEra
    }, indexes);
  })));
}