"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _axios, _config, _actions, _setCodeOrNull;
exports.__esModule = true;
exports.AsyncRequestBuilder = exports.RejectedForCodeActionCall = void 0;
var ResponseCode_1 = require("@/global/response-code/ResponseCode");
var ToastProvider_1 = require("@/global/toast/ToastProvider");
// 요청 Promise의 실패의 원인이 CodeAction의 올바른 호출에 의한 것인 경우 해당 에러를 통해 reject한다.
var RejectedForCodeActionCall = /** @class */ (function () {
    function RejectedForCodeActionCall(code, message) {
        this.message = message;
        this.name = code;
    }
    return RejectedForCodeActionCall;
}());
exports.RejectedForCodeActionCall = RejectedForCodeActionCall;
var AsyncRequestBuilder = /** @class */ (function () {
    function AsyncRequestBuilder(axios, setCodeOrNull) {
        _axios.set(this, void 0);
        _config.set(this, void 0);
        _actions.set(this, void 0);
        _setCodeOrNull.set(this, void 0);
        __classPrivateFieldSet(this, _axios, axios);
        __classPrivateFieldSet(this, _config, {});
        __classPrivateFieldSet(this, _actions, {});
        __classPrivateFieldSet(this, _setCodeOrNull, setCodeOrNull);
    }
    AsyncRequestBuilder.prototype.get = function (url) {
        __classPrivateFieldGet(this, _config).method = "GET";
        __classPrivateFieldGet(this, _config).url = url;
        return this;
    };
    AsyncRequestBuilder.prototype.post = function (url) {
        __classPrivateFieldGet(this, _config).method = "POST";
        __classPrivateFieldGet(this, _config).url = url;
        return this;
    };
    AsyncRequestBuilder.prototype.put = function (url) {
        __classPrivateFieldGet(this, _config).method = "PUT";
        __classPrivateFieldGet(this, _config).url = url;
        return this;
    };
    AsyncRequestBuilder.prototype["delete"] = function (url) {
        __classPrivateFieldGet(this, _config).method = "DELETE";
        __classPrivateFieldGet(this, _config).url = url;
        return this;
    };
    // Response Code별 처리 핸들러 정의서
    AsyncRequestBuilder.prototype.actions = function (actions) {
        __classPrivateFieldSet(this, _actions, actions);
        return this;
    };
    AsyncRequestBuilder.prototype.action = function (code, action) {
        __classPrivateFieldGet(this, _actions)[code] = action;
        return this;
    };
    // Request Body
    AsyncRequestBuilder.prototype.data = function (data) {
        __classPrivateFieldGet(this, _config).data = data;
        return this;
    };
    // queryString에 추가될 parameters
    AsyncRequestBuilder.prototype.params = function (params) {
        __classPrivateFieldGet(this, _config).params = params;
        return this;
    };
    // 요청타입 헤더
    AsyncRequestBuilder.prototype.contentType = function (type) {
        __classPrivateFieldGet(this, _config).headers = __assign(__assign({}, __classPrivateFieldGet(this, _config).headers), { "Content-type": type });
        return this;
    };
    /*
     * 서버의 응답 코드에 따라서 SUCCESS 코드인 경우 응답된 데이터를 반환하고,
     * 그 외의 코드의 경우는 actions 객체에서 정의된 핸들러를 호출한다.
     * 만약 actions에 해당 코드에 대한 핸들러가 정의되지 않은 경우, 에러를 발생시킨다.
     */
    AsyncRequestBuilder.prototype.fetch = function () {
        return __awaiter(this, void 0, Promise, function () {
            var axiosRes, res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, __classPrivateFieldGet(this, _axios).request(__classPrivateFieldGet(this, _config))];
                    case 1:
                        axiosRes = _a.sent();
                        res = axiosRes.data;
                        // useApi 훅으로 반환한 code값의 상태를 업데이트.(default value: LOADING)
                        if (__classPrivateFieldGet(this, _setCodeOrNull)) {
                            __classPrivateFieldGet(this, _setCodeOrNull).call(this, res.code);
                        }
                        // 성공하지 못했다면 Actions에서 코드에 따른 핸들러를 호출
                        if (res.code !== ResponseCode_1.CodeType.common.SUCCESS) {
                            if (__classPrivateFieldGet(this, _actions) && res.code in __classPrivateFieldGet(this, _actions) && typeof __classPrivateFieldGet(this, _actions)[res.code] === "function") {
                                try {
                                    console.debug("[\uC751\uB2F5 \uCF54\uB4DC\uC5D0 \uC758\uD55C \uBD84\uAE30]: \uCF54\uB4DC [" + res.code + "]\uAC00 \uBC1C\uC0DD\uD558\uC5EC, \uC815\uC758\uB41C Action\uC744 \uD638\uCD9C\uD569\uB2C8\uB2E4.");
                                    __classPrivateFieldGet(this, _actions)[res.code](res.data);
                                    return [2 /*return*/, Promise.reject(new RejectedForCodeActionCall(res.code, res.message))];
                                    // action 내부에서 에러가 발생한 경우
                                }
                                catch (e) {
                                    throw new Error("[CodeAction Error]: [" + res.code + "]\uC73C\uB85C \uC815\uC758\uB41C CodeAction \uD638\uCD9C\uC911 \uC5D0\uB7EC\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \n Callback Actions \uC5D0\uB7EC: " + e.message);
                                }
                                // 정의된 actions가 없거나, actions에서 해당 코드에 대한 핸들러를 찾을 수 없는 경우
                            }
                            else {
                                throw new Error("[CodeAction never defined]: [" + res.code + "](\"" + res.message + "\") \uCF54\uB4DC\uC5D0 \uB300\uD55C CodeAction\uC774 \uC815\uC758\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. ");
                            }
                            // 성공했다면, 데이터를 반환
                        }
                        else {
                            return [2 /*return*/, res.data];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        ToastProvider_1.triggerToast({
                            variant: "destructive",
                            title: "요청 실패",
                            description: "서버 요청 중 문제가 발생했습니다. 잠시후 다시 시도해주세요."
                        });
                        return [2 /*return*/, Promise.reject(e_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AsyncRequestBuilder;
}());
exports.AsyncRequestBuilder = AsyncRequestBuilder;
_axios = new WeakMap(), _config = new WeakMap(), _actions = new WeakMap(), _setCodeOrNull = new WeakMap();
