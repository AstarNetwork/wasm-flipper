/// <reference types="bn.js" />
import type { BN } from '../bn/bn';
import type { NumberOptions, ToBigInt, ToBn } from '../types';
/**
 * @name nToU8a
 * @summary Creates a Uint8Array object from a bigint.
 */
export declare function nToU8a<ExtToBn extends ToBn | ToBigInt>(value?: ExtToBn | BN | bigint | number | null, options?: NumberOptions): Uint8Array;
