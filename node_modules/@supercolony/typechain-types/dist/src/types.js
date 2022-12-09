"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnNumber = exports.ResultBuilder = void 0;
var bn_js_1 = __importDefault(require("bn.js"));
;
;
var ResultBuilder = /** @class */ (function () {
    function ResultBuilder() {
    }
    ResultBuilder.Ok = function (value) {
        return {
            ok: value,
        };
    };
    ResultBuilder.Err = function (error) {
        return {
            err: error,
        };
    };
    return ResultBuilder;
}());
exports.ResultBuilder = ResultBuilder;
var ReturnNumber = /** @class */ (function () {
    function ReturnNumber(value) {
        if (typeof value == 'number') {
            this.rawNumber = new bn_js_1.default(value);
        }
        else {
            this.rawNumber = new bn_js_1.default(value.substring(2), 16);
        }
    }
    ReturnNumber.prototype.toString = function () {
        return this.rawNumber.toString();
    };
    ReturnNumber.prototype.toHuman = function () {
        return this.toString();
    };
    ReturnNumber.prototype.toNumber = function () {
        return this.rawNumber.toNumber();
    };
    ReturnNumber.ToBN = function (value) {
        return new ReturnNumber(value).rawNumber;
    };
    return ReturnNumber;
}());
exports.ReturnNumber = ReturnNumber;
