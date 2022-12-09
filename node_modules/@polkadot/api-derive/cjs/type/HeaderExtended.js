"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHeaderExtended = createHeaderExtended;
var _util = require("./util");
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function createHeaderExtended(registry, header, validators, author) {
  // an instance of the base extrinsic for us to extend
  const HeaderBase = registry.createClass('Header');
  class Implementation extends HeaderBase {
    #author;
    constructor(registry, header, validators, author) {
      super(registry, header);
      this.#author = author || (0, _util.extractAuthor)(this.digest, validators || []);
      this.createdAtHash = header == null ? void 0 : header.createdAtHash;
    }

    /**
     * @description Convenience method, returns the author for the block
     */
    get author() {
      return this.#author;
    }
  }
  return new Implementation(registry, header, validators, author);
}