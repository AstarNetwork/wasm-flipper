import type { Bytes } from '@polkadot/types';
import type { ChainProperties, ContractMetadataLatest, ContractProjectInfo } from '@polkadot/types/interfaces';
import type { Registry } from '@polkadot/types/types';
import type { AbiConstructor, AbiEvent, AbiMessage, DecodedEvent, DecodedMessage } from '../types';
export declare class Abi {
    #private;
    readonly events: AbiEvent[];
    readonly constructors: AbiConstructor[];
    readonly info: ContractProjectInfo;
    readonly json: Record<string, unknown>;
    readonly messages: AbiMessage[];
    readonly metadata: ContractMetadataLatest;
    readonly registry: Registry;
    constructor(abiJson: Record<string, unknown> | string, chainProperties?: ChainProperties);
    /**
     * Warning: Unstable API, bound to change
     */
    decodeEvent(data: Bytes | Uint8Array): DecodedEvent;
    /**
     * Warning: Unstable API, bound to change
     */
    decodeConstructor(data: Uint8Array): DecodedMessage;
    /**
     * Warning: Unstable API, bound to change
     */
    decodeMessage(data: Uint8Array): DecodedMessage;
    findConstructor(constructorOrId: AbiConstructor | string | number): AbiConstructor;
    findMessage(messageOrId: AbiMessage | string | number): AbiMessage;
}
