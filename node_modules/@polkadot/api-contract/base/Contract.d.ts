import type { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { DecodedEvent } from '../types';
import type { MapMessageQuery, MapMessageTx } from './types';
import { SubmittableResult } from '@polkadot/api';
import { ApiBase } from '@polkadot/api/base';
import { Abi } from '../Abi';
import { Base } from './Base';
export interface ContractConstructor<ApiType extends ApiTypes> {
    new (api: ApiBase<ApiType>, abi: string | Record<string, unknown> | Abi, address: string | AccountId): Contract<ApiType>;
}
export declare class ContractSubmittableResult extends SubmittableResult {
    readonly contractEvents?: DecodedEvent[];
    constructor(result: ISubmittableResult, contractEvents?: DecodedEvent[]);
}
export declare class Contract<ApiType extends ApiTypes> extends Base<ApiType> {
    #private;
    /**
     * @description The on-chain address for this contract
     */
    readonly address: AccountId;
    constructor(api: ApiBase<ApiType>, abi: string | Record<string, unknown> | Abi, address: string | AccountId, decorateMethod: DecorateMethod<ApiType>);
    get query(): MapMessageQuery<ApiType>;
    get tx(): MapMessageTx<ApiType>;
}
export declare function extendContract<ApiType extends ApiTypes>(type: ApiType, decorateMethod: DecorateMethod<ApiType>): ContractConstructor<ApiType>;
