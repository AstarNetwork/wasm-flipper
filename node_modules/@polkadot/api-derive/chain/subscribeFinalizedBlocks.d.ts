import type { Observable } from 'rxjs';
import type { SignedBlockExtended } from '../type/types';
import type { DeriveApi } from '../types';
/**
 * @name subscribeFinalizedBlocks
 * @returns The finalized block & events for that block
 */
export declare function subscribeFinalizedBlocks(instanceId: string, api: DeriveApi): () => Observable<SignedBlockExtended>;
