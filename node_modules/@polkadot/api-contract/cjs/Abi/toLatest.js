"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.v3ToLatest = exports.v2ToLatest = exports.v1ToLatest = exports.v0ToLatest = exports.enumVersions = exports.convertVersions = void 0;
exports.v4ToLatest = v4ToLatest;
var _toV = require("./toV1");
var _toV2 = require("./toV2");
var _toV3 = require("./toV3");
var _toV4 = require("./toV4");
// Copyright 2017-2022 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The versions where an enum is used, aka V0 is missing
// (Order from newest, i.e. we expect more on newest vs oldest)
const enumVersions = ['V4', 'V3', 'V2', 'V1'];
exports.enumVersions = enumVersions;
// Helper to convert metadata from one step to the next
function createConverter(next, step) {
  return (registry, input) => next(registry, step(registry, input));
}
function v4ToLatest(registry, v4) {
  return v4;
}
const v3ToLatest = createConverter(v4ToLatest, _toV4.v3ToV4);
exports.v3ToLatest = v3ToLatest;
const v2ToLatest = createConverter(v3ToLatest, _toV3.v2ToV3);
exports.v2ToLatest = v2ToLatest;
const v1ToLatest = createConverter(v2ToLatest, _toV2.v1ToV2);
exports.v1ToLatest = v1ToLatest;
const v0ToLatest = createConverter(v1ToLatest, _toV.v0ToV1);
exports.v0ToLatest = v0ToLatest;
const convertVersions = [['V4', v4ToLatest], ['V3', v3ToLatest], ['V2', v2ToLatest], ['V1', v1ToLatest], ['V0', v0ToLatest]];
exports.convertVersions = convertVersions;