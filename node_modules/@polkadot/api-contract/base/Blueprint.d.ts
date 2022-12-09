import type { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { MapConstructorExec } from './types';
import { SubmittableResult } from '@polkadot/api';
import { ApiBase } from '@polkadot/api/base';
import { Abi } from '../Abi';
import { Base } from './Base';
import { Contract } from './Contract';
export interface BlueprintConstructor<ApiType extends ApiTypes> {
    new (api: ApiBase<ApiType>, abi: string | Record<string, unknown> | Abi, codeHash: string | Hash | Uint8Array): Blueprint<ApiType>;
}
export declare class BlueprintSubmittableResult<ApiType extends ApiTypes> extends SubmittableResult {
    readonly contract?: Contract<ApiType>;
    constructor(result: ISubmittableResult, contract?: Contract<ApiType>);
}
export declare class Blueprint<ApiType extends ApiTypes> extends Base<ApiType> {
    #private;
    /**
     * @description The on-chain code hash for this blueprint
     */
    readonly codeHash: Hash;
    constructor(api: ApiBase<ApiType>, abi: string | Record<string, unknown> | Abi, codeHash: string | Hash | Uint8Array, decorateMethod: DecorateMethod<ApiType>);
    get tx(): MapConstructorExec<ApiType>;
}
export declare function extendBlueprint<ApiType extends ApiTypes>(type: ApiType, decorateMethod: DecorateMethod<ApiType>): BlueprintConstructor<ApiType>;
