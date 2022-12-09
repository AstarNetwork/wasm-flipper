import { BigInt } from '@polkadot/x-bigint';
export declare abstract class AbstractBigInt extends BigInt {
    constructor(value: string | number | bigint | boolean);
}
