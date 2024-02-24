"use strict";
exports.__esModule = true;
exports.RootAuthFromLocalStorage = void 0;
var dynamic_1 = require("next/dynamic");
exports.RootAuthFromLocalStorage = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require('@/global/hook/useRootAuth'); }).then(function (mod) { return mod.useRootAuth; }); }, { ssr: false });
