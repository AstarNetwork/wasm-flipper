// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { map, of, switchMap } from 'rxjs';
import { BN_ZERO, isFunction } from '@polkadot/util';
import { firstMemo, memo } from "../util/index.js";
import { getImageHashBounded } from "./util.js";
function isDemocracyPreimage(api, imageOpt) {
  return !!imageOpt && !api.query.democracy.dispatchQueue;
}
function constructProposal(api, [bytes, proposer, balance, at]) {
  let proposal;
  try {
    proposal = api.registry.createType('Call', bytes.toU8a(true));
  } catch (error) {
    console.error(error);
  }
  return {
    at,
    balance,
    proposal,
    proposer
  };
}
function parseDemocracy(api, imageOpt) {
  if (imageOpt.isNone) {
    return;
  }
  if (isDemocracyPreimage(api, imageOpt)) {
    const status = imageOpt.unwrap();
    if (status.isMissing) {
      return;
    }
    const {
      data,
      deposit,
      provider,
      since
    } = status.asAvailable;
    return constructProposal(api, [data, provider, deposit, since]);
  }
  return constructProposal(api, imageOpt.unwrap());
}
function parseImage(api, [proposalHash, status, bytes]) {
  if (!status) {
    return undefined;
  }
  const [proposer, balance] = status.isUnrequested ? status.asUnrequested.deposit : status.asRequested.deposit.unwrapOrDefault();
  let proposal;
  if (bytes) {
    try {
      proposal = api.registry.createType('Call', bytes.toU8a(true));
    } catch (error) {
      console.error(error);
    }
  }
  return {
    at: BN_ZERO,
    balance,
    proposal,
    proposalHash,
    proposer
  };
}
function getDemocracyImages(api, hashes) {
  return api.query.democracy.preimages.multi(hashes).pipe(map(images => images.map(imageOpt => parseDemocracy(api, imageOpt))));
}
function getImages(api, bounded) {
  const hashes = bounded.map(b => getImageHashBounded(b));
  return api.query.preimage.statusFor.multi(hashes).pipe(switchMap(optStatus => {
    const statuses = optStatus.map(o => o.unwrapOr(null));
    const keys = statuses.map((s, i) => s ? s.isRequested ? [hashes[i], s.asRequested.len.unwrapOr(0)] : [hashes[i], s.asUnrequested.len] : null).filter(p => !!p);
    return api.query.preimage.preimageFor.multi(keys).pipe(map(optBytes => {
      let ptr = -1;
      return statuses.map((s, i) => s ? [hashes[i], s, optBytes[++ptr].unwrapOr(null)] : [hashes[i], null, null]).map(v => parseImage(api, v));
    }));
  }));
}
export function preimages(instanceId, api) {
  return memo(instanceId, hashes => hashes.length ? isFunction(api.query.democracy.preimages) ? getDemocracyImages(api, hashes) : isFunction(api.query.preimage.preimageFor) ? getImages(api, hashes) : of([]) : of([]));
}
export const preimage = firstMemo((api, hash) => api.derive.democracy.preimages([hash]));