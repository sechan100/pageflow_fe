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
exports.useAuth = void 0;
var AccessTokenStorage_1 = require("@/bounded-context/user/service/AccessTokenStorage");
var zustand_1 = require("zustand");
var DefaultAxiosFactory_1 = require("@/global/api/DefaultAxiosFactory");
var ToastProvider_1 = require("@/global/toast/ToastProvider");
var useRootAuth_1 = require("./useRootAuth");
var AsyncRequestBuilder_1 = require("@/global/api/AsyncRequestBuilder");
var useAccessTokenStore = zustand_1.create(function (set, get) { return ({
    storage: new AccessTokenStorage_1.PrivatePropertyAccessTokenStorage()
}); });
exports.useAuth = function () {
    var isAuthenticated = useRootAuth_1.useRootAuth().isAuthenticated; // 인증 상태 참조
    var storage = useAccessTokenStore().storage; // 저장소 참조
    var storeToken = function (token) {
        useAccessTokenStore.getState().storage.store(token);
    };
    var clearToken = function () {
        useAccessTokenStore.getState().storage.clear();
    };
    var ensureToken = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isTokenExist, isRefreshRequired, request, accessToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isTokenExist = storage.isTokenExist();
                    isRefreshRequired = false;
                    // [2]: 토큰 상태 검증
                    // 토큰 있음 => 만료여부 확인 
                    if (isTokenExist) {
                        if (storage.isTokenExpired()) {
                            isRefreshRequired = true;
                        }
                        /**
                         * 토큰 없음 -> isAuthentication이 true라면, refresh 요청을 보냄
                         */
                    }
                    else {
                        if (isAuthenticated) {
                            isRefreshRequired = true;
                        }
                    }
                    if (!isRefreshRequired) return [3 /*break*/, 2];
                    request = new AsyncRequestBuilder_1.AsyncRequestBuilder(DefaultAxiosFactory_1.DefaultAxiosFactory.createDefaultAxiosInstance(), null);
                    console.debug("refresh 요청 전송됨...");
                    return [4 /*yield*/, request.post("/refresh")
                            .actions({
                            TOKEN_NOT_FOUND: TOKEN_NOT_FOUND,
                            SESSION_EXPIRED: SESSION_EXPIRED // refreshTokenUUID 쿠키가 있지만, 만료된 경우 -> 세션 만료
                        })
                            .fetch()];
                case 1:
                    accessToken = _a.sent();
                    // 받아온 토큰 저장 후 반환.
                    storage.store(accessToken);
                    return [2 /*return*/, accessToken.compact];
                case 2: return [2 /*return*/, storage.getToken()];
            }
        });
    }); };
    return {
        storeToken: storeToken,
        clearToken: clearToken,
        ensureToken: ensureToken
    };
};
// CodeActions
function TOKEN_NOT_FOUND() {
    // 로그아웃 처리
    useRootAuth_1.useRootAuth().logout();
    ToastProvider_1.triggerToast({
        title: "로그인이 필요합니다",
        action: {
            description: "로그인하러 가기",
            onClick: function () { console.log("로그인 페이지로 이동"); }
        }
    });
}
function SESSION_EXPIRED() {
    // 로그아웃 처리
    useRootAuth_1.useRootAuth().logout();
    ToastProvider_1.triggerToast({
        title: "만료된 세션입니다. 다시 로그인 해주세요.",
        action: {
            description: "로그인하러 가기",
            onClick: function () { console.log("로그인 페이지로 이동"); }
        }
    });
}
