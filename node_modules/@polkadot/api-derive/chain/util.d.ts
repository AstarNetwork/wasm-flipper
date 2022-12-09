import type { Observable } from 'rxjs';
import type { QueryableStorage } from '@polkadot/api-base/types';
import type { Compact, Vec } from '@polkadot/types';
import type { AccountId, BlockNumber, Header } from '@polkadot/types/interfaces';
import type { DeriveApi } from '../types';
export type { BlockNumber } from '@polkadot/types/interfaces';
export declare function createBlockNumberDerive<T extends {
    number: Compact<BlockNumber> | BlockNumber;
}>(fn: (api: DeriveApi) => Observable<T>): (instanceId: string, api: DeriveApi) => () => Observable<BlockNumber>;
export declare function getAuthorDetails(header: Header, queryAt: QueryableStorage<'rxjs'>): Observable<[Header, Vec<AccountId> | null, AccountId | null]>;
