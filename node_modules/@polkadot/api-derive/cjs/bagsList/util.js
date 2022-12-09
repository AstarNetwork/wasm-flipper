"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryInterface = getQueryInterface;
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

function getQueryInterface(api) {
  return (
    // latest substrate (latest always first)
    api.query.voterBagsList ||
    // previous substrate
    api.query.bagsList ||
    // latest polkadot
    api.query.voterList
  );
}