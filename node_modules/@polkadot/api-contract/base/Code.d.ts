/// <reference types="node" />
import type { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { MapConstructorExec } from './types';
import { SubmittableResult } from '@polkadot/api';
import { ApiBase } from '@polkadot/api/base';
import { Abi } from '../Abi';
import { Base } from './Base';
import { Blueprint } from './Blueprint';
import { Contract } from './Contract';
export interface CodeConstructor<ApiType extends ApiTypes> {
    new (api: ApiBase<ApiType>, abi: string | Record<string, unknown> | Abi, wasm: Uint8Array | string | Buffer | null | undefined): Code<ApiType>;
}
export declare class CodeSubmittableResult<ApiType extends ApiTypes> extends SubmittableResult {
    readonly blueprint?: Blueprint<ApiType>;
    readonly contract?: Contract<ApiType>;
    constructor(result: ISubmittableResult, blueprint?: Blueprint<ApiType>, contract?: Contract<ApiType>);
}
export declare class Code<ApiType extends ApiTypes> extends Base<ApiType> {
    #private;
    readonly code: Uint8Array;
    constructor(api: ApiBase<ApiType>, abi: string | Record<string, unknown> | Abi, wasm: Uint8Array | string | Buffer | null | undefined, decorateMethod: DecorateMethod<ApiType>);
    get tx(): MapConstructorExec<ApiType>;
}
export declare function extendCode<ApiType extends ApiTypes>(type: ApiType, decorateMethod: DecorateMethod<ApiType>): CodeConstructor<ApiType>;
