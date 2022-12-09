// Copyright (c) 2012-2022 Supercolony
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the"Software"),
// to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import BN from "bn.js";

export interface Method {
	name: string;
	originalName: string;
	args : {
		name : string;
		type : {
			id : number | string;
		};
	}[];
	payable ? : boolean;
	returnType ? : undefined | null | {
		id : number | string;
		tsStr : string,
	};
	resultQuery ?: boolean
	mutating ? : boolean;
	methodType ? : 'query' | 'tx' | 'extrinsic' | 'constructor';
	pathToContractFile ? : string;
}

export interface Type {
	id: number | string;
	tsStr: string;
}

export interface Import {
	values: string[];
	path: string;
}

export interface PolkadotEvent {
	name: string;
}