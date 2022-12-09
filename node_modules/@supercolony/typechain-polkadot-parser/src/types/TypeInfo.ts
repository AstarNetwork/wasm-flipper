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

export class TypeInfo {
	id: number;
	tsArgType: string;
	tsReturnType: string;
	tsArgTypePrefixed: string;
	tsReturnTypePrefixed: string;
	typeDescription: TypeTS;
	// For enums and composites
	bodyArgType ?: string;
	bodyReturnType ?: string;

	/**
	 * @constructor
	 * @memberOf TypeInfo
	 *
	 * @param id - The id of the type
	 * @param tsArgType - Typescript-type of type when it used for arguments
	 * @param tsReturnType - Typescript-type of type when it used for return values
	 * @param tsArgTypePrefixed - Typescript-type of type when it used for arguments, with prefix (ArgumentTypes.*)
	 * @param tsReturnTypePrefixed - Typescript-type of type when it used for return values, with prefix (ReturnTypes.*)
	 * @param typeDescription - Description of type when it used for arguments
	 * @param bodyArgType - Body of Typescript-type if it is a composite type or enum (for arguments)
	 * @param bodyReturnType - Body of Typescript-type if it is a composite type or enum (for return values)
	 */
	constructor(
		id: number,
		tsArgType: string,
		tsReturnType: string,
		tsArgTypePrefixed: string,
		tsReturnTypePrefixed: string,
		typeDescription: TypeTS,
		bodyArgType?: string,
		bodyReturnType?: string
	) {
		this.id = id;
		this.tsArgType = tsArgType;
		this.tsReturnType = tsReturnType;
		this.bodyArgType = bodyArgType;
		this.bodyReturnType = bodyReturnType;
		this.tsArgTypePrefixed = tsArgTypePrefixed;
		this.tsReturnTypePrefixed = tsReturnTypePrefixed;
		this.typeDescription = typeDescription;
	}

	/**
	 * @memberOf TypeInfo
	 * @returns {TypeInfo} - A new empty TypeInfo object
	 */
	static get EMPTY_TYPE_INFO() {
		return new TypeInfo(0, '', '', '', '', new TypeTS('', false, true), '', '');
	}
}

export class TypeTS {
	name: string;
	body: null | undefined | string | {
		[index: string]: TypeTS | null;
	};
	isPrimitive: boolean;
	isConvertable: boolean;

	constructor(name: string, isConvertable: boolean, isPrimitive: boolean, body?: null | undefined | string | {
		[index: string]: TypeTS | null;
	}) {
		this.name = name;
		this.isConvertable = isConvertable;
		this.isPrimitive = isPrimitive;
		this.body = body;
	}

	logger() {
		console.log(this);
	}

	toString() {
		return JSON.stringify(this);
	}
}