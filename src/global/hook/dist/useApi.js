"use strict";
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
exports.__esModule = true;
exports.useApi = void 0;
var zustand_1 = require("zustand");
var DefaultAxiosFactory_1 = require("../api/DefaultAxiosFactory");
var AsyncRequestBuilder_1 = require("../api/AsyncRequestBuilder");
var react_1 = require("react");
var ApiCode_1 = require("@/global/api/ApiCode");
var useAuth_1 = require("./useAuth");
var BEARER = "Bearer ";
var axiosStore = zustand_1.create(function (set) { return ({
    axios: null
}); });
exports.useApi = function () {
    var _a = react_1.useState(ApiCode_1.ApiCode.clientOnly.LOADING), apiCode = _a[0], setApiCode = _a[1];
    var ensureToken = useAuth_1.useAuth().ensureToken;
    var axios = axiosStore().axios;
    if (axios) {
        return {
            api: new AsyncRequestBuilder_1.AsyncRequestBuilder(axios, setApiCode),
            apiCode: apiCode
        };
    }
    // 기본 요청 객체에 interceptor를 추가하기 위해, 새로운 요청체를 생성
    var newAxios = DefaultAxiosFactory_1.DefaultAxiosFactory.createDefaultAxiosInstance();
    newAxios.defaults.headers['Content-type'] = 'application/json; charset=UTF-8'; // 요청타입 헤더
    newAxios.defaults.headers['Accept'] = 'application/json'; // 응답타입 헤더
    // Axios async Interceptor 정의
    var interceptorCallBack = function (config) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!config.headers["Pageflow-Auth"]) return [3 /*break*/, 2];
                    _a = config.headers;
                    _b = "Authorization";
                    _c = BEARER;
                    return [4 /*yield*/, ensureToken()];
                case 1:
                    _a[_b] = _c + (_d.sent());
                    _d.label = 2;
                case 2: return [2 /*return*/, config];
            }
        });
    }); };
    // Axios Error Interceptor
    var interceptorErrorCallback = function (err) {
        return Promise.reject(err);
    };
    // 요청객체 인터셉터를 할당하고 store에 저장
    newAxios.interceptors.request.use(interceptorCallBack, interceptorErrorCallback);
    axiosStore.setState({ axios: newAxios });
    return {
        api: new AsyncRequestBuilder_1.AsyncRequestBuilder(newAxios, setApiCode),
        apiCode: apiCode
    };
};
