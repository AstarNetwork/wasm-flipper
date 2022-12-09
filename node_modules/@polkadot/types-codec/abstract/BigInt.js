// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BigInt } from '@polkadot/x-bigint';

// @ts-expect-error not extensible, we make it extensible here
export class AbstractBigInt extends BigInt {
  // @ts-expect-error super() not required, the self magic does that
  constructor(value) {
    const self = Object(BigInt(value));
    Object.setPrototypeOf(self, AbstractBigInt.prototype);
    return self;
  }
}