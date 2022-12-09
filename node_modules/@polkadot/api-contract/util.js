// Copyright 2017-2022 @polkadot/rpc-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function applyOnEvent(result, types, fn) {
  if (result.isInBlock || result.isFinalized) {
    const records = result.filterRecords('contracts', types);
    if (records.length) {
      return fn(records);
    }
  }
  return undefined;
}