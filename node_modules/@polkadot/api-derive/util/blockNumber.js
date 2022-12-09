// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isCompact } from '@polkadot/util';
export function unwrapBlockNumber(hdr) {
  return isCompact(hdr.number) ? hdr.number.unwrap() : hdr.number;
}