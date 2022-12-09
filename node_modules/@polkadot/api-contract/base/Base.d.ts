import type { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import type { Registry } from '@polkadot/types/types';
import { ApiBase } from '@polkadot/api/base';
import { Abi } from '../Abi';
export declare abstract class Base<ApiType extends ApiTypes> {
    readonly abi: Abi;
    readonly api: ApiBase<ApiType>;
    protected readonly _decorateMethod: DecorateMethod<ApiType>;
    protected readonly _isWeightV1: boolean;
    constructor(api: ApiBase<ApiType>, abi: string | Record<string, unknown> | Abi, decorateMethod: DecorateMethod<ApiType>);
    get registry(): Registry;
}
