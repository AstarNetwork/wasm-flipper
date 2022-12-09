"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Abi = void 0;
var _types = require("@polkadot/types");
var _typesCreate = require("@polkadot/types-create");
var _util = require("@polkadot/util");
var _toLatest = require("./toLatest");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

const l = (0, _util.logger)('Abi');
const PRIMITIVE_ALWAYS = ['AccountId', 'AccountIndex', 'Address', 'Balance'];
function findMessage(list, messageOrId) {
  const message = (0, _util.isNumber)(messageOrId) ? list[messageOrId] : (0, _util.isString)(messageOrId) ? list.find(_ref => {
    let {
      identifier
    } = _ref;
    return [identifier, (0, _util.stringCamelCase)(identifier)].includes(messageOrId.toString());
  }) : messageOrId;
  return (0, _util.assertReturn)(message, () => `Attempted to call an invalid contract interface, ${(0, _util.stringify)(messageOrId)}`);
}
function getLatestMeta(registry, json) {
  // this is for V1, V2, V3
  const vx = _toLatest.enumVersions.find(v => (0, _util.isObject)(json[v]));

  // this was added in V4
  const jsonVersion = json.version;
  if (!vx && jsonVersion && !_toLatest.enumVersions.find(v => v === `V${jsonVersion}`)) {
    throw new Error(`Unable to handle version ${jsonVersion}`);
  }
  const metadata = registry.createType('ContractMetadata', vx ? {
    [vx]: json[vx]
  } : jsonVersion ? {
    [`V${jsonVersion}`]: json
  } : {
    V0: json
  });
  const converter = _toLatest.convertVersions.find(_ref2 => {
    let [v] = _ref2;
    return metadata[`is${v}`];
  });
  if (!converter) {
    throw new Error(`Unable to convert ABI with version ${metadata.type} to latest`);
  }
  return converter[1](registry, metadata[`as${converter[0]}`]);
}
function parseJson(json, chainProperties) {
  const registry = new _types.TypeRegistry();
  const info = registry.createType('ContractProjectInfo', json);
  const latest = getLatestMeta(registry, json);
  const lookup = registry.createType('PortableRegistry', {
    types: latest.types
  }, true);

  // attach the lookup to the registry - now the types are known
  registry.setLookup(lookup);
  if (chainProperties) {
    registry.setChainProperties(chainProperties);
  }

  // warm-up the actual type, pre-use
  lookup.types.forEach(_ref3 => {
    let {
      id
    } = _ref3;
    return lookup.getTypeDef(id);
  });
  return [json, registry, latest, info];
}
class Abi {
  constructor(abiJson, chainProperties) {
    [this.json, this.registry, this.metadata, this.info] = parseJson((0, _util.isString)(abiJson) ? JSON.parse(abiJson) : abiJson, chainProperties);
    this.constructors = this.metadata.spec.constructors.map((spec, index) => this.#createMessage(spec, index, {
      isConstructor: true,
      isPayable: spec.payable.isTrue
    }));
    this.events = this.metadata.spec.events.map((spec, index) => this.#createEvent(spec, index));
    this.messages = this.metadata.spec.messages.map((spec, index) => {
      const typeSpec = spec.returnType.unwrapOr(null);
      return this.#createMessage(spec, index, {
        isMutating: spec.mutates.isTrue,
        isPayable: spec.payable.isTrue,
        returnType: typeSpec ? this.registry.lookup.getTypeDef(typeSpec.type) : null
      });
    });
  }

  /**
   * Warning: Unstable API, bound to change
   */
  decodeEvent(data) {
    const index = data[0];
    const event = this.events[index];
    if (!event) {
      throw new Error(`Unable to find event with index ${index}`);
    }
    return event.fromU8a(data.subarray(1));
  }

  /**
   * Warning: Unstable API, bound to change
   */
  decodeConstructor(data) {
    return this.#decodeMessage('message', this.constructors, data);
  }

  /**
   * Warning: Unstable API, bound to change
   */
  decodeMessage(data) {
    return this.#decodeMessage('message', this.messages, data);
  }
  findConstructor(constructorOrId) {
    return findMessage(this.constructors, constructorOrId);
  }
  findMessage(messageOrId) {
    return findMessage(this.messages, messageOrId);
  }
  #createArgs = (args, spec) => {
    return args.map((_ref4, index) => {
      let {
        label,
        type
      } = _ref4;
      try {
        if (!(0, _util.isObject)(type)) {
          throw new Error('Invalid type definition found');
        }
        const displayName = type.displayName.length ? type.displayName[type.displayName.length - 1].toString() : undefined;
        const camelName = (0, _util.stringCamelCase)(label);
        if (displayName && PRIMITIVE_ALWAYS.includes(displayName)) {
          return {
            name: camelName,
            type: {
              info: _typesCreate.TypeDefInfo.Plain,
              type: displayName
            }
          };
        }
        const typeDef = this.registry.lookup.getTypeDef(type.type);
        return {
          name: camelName,
          type: displayName && !typeDef.type.startsWith(displayName) ? {
            displayName,
            ...typeDef
          } : typeDef
        };
      } catch (error) {
        l.error(`Error expanding argument ${index} in ${(0, _util.stringify)(spec)}`);
        throw error;
      }
    });
  };
  #createEvent = (spec, index) => {
    const args = this.#createArgs(spec.args, spec);
    const event = {
      args,
      docs: spec.docs.map(d => d.toString()),
      fromU8a: data => ({
        args: this.#decodeArgs(args, data),
        event
      }),
      identifier: spec.label.toString(),
      index
    };
    return event;
  };
  #createMessage = (() => {
    var _this = this;
    return function (spec, index) {
      let add = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      const args = _this.#createArgs(spec.args, spec);
      const identifier = spec.label.toString();
      const message = {
        ...add,
        args,
        docs: spec.docs.map(d => d.toString()),
        fromU8a: data => ({
          args: _this.#decodeArgs(args, data),
          message
        }),
        identifier,
        index,
        method: (0, _util.stringCamelCase)(identifier),
        path: identifier.split('::').map(s => (0, _util.stringCamelCase)(s)),
        selector: spec.selector,
        toU8a: params => _this.#encodeArgs(spec, args, params)
      };
      return message;
    };
  })();
  #decodeArgs = (args, data) => {
    // for decoding we expect the input to be just the arg data, no selectors
    // no length added (this allows use with events as well)
    let offset = 0;
    return args.map(_ref5 => {
      let {
        type: {
          lookupName,
          type
        }
      } = _ref5;
      const value = this.registry.createType(lookupName || type, data.subarray(offset));
      offset += value.encodedLength;
      return value;
    });
  };
  #decodeMessage = (type, list, data) => {
    const [, trimmed] = (0, _util.compactStripLength)(data);
    const selector = trimmed.subarray(0, 4);
    const message = list.find(m => m.selector.eq(selector));
    if (!message) {
      throw new Error(`Unable to find ${type} with selector ${(0, _util.u8aToHex)(selector)}`);
    }
    return message.fromU8a(trimmed.subarray(4));
  };
  #encodeArgs = (_ref6, args, data) => {
    let {
      label,
      selector
    } = _ref6;
    if (data.length !== args.length) {
      throw new Error(`Expected ${args.length} arguments to contract message '${label.toString()}', found ${data.length}`);
    }
    return (0, _util.compactAddLength)((0, _util.u8aConcat)(this.registry.createType('ContractSelector', selector).toU8a(), ...args.map((_ref7, index) => {
      let {
        type: {
          lookupName,
          type
        }
      } = _ref7;
      return this.registry.createType(lookupName || type, data[index]).toU8a();
    })));
  };
}
exports.Abi = Abi;