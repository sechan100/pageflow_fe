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
var AccessTokenStorage_1 = require("@/bounded-context/user/services/AccessTokenStorage");
var zustand_1 = require("zustand");
var DefaultAxiosFactory_1 = require("./DefaultAxiosFactory");
var ToastProvider_1 = require("@/global/toast/ToastProvider");
var AsyncRequestBuilder_1 = require("../../../global/apis/AsyncRequestBuilder");
var accessTokenStore = zustand_1.create(function (set) { return ({
    storage: new AccessTokenStorage_1.PrivatePropertyAccessTokenStorage()
}); });
var ensureValidAccessToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var storage, isTokenExist, isRefreshRequired, request, accessToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                storage = accessTokenStore().storage;
                isTokenExist = storage.isTokenExist();
                isRefreshRequired = false;
                // [2]: 토큰 상태 검증
                // 토큰 있음 => 만료여부 확인 
                if (isTokenExist) {
                    if (storage.isTokenExpired()) {
                        isRefreshRequired = true;
                    }
                    /**
                     * 토큰 없음 -> refreshTokenUUID쿠키가 httpOnly이기 때문에 존재하는지 알 수 없음.
                     * 때문에 일단 존재한다고 전제하고 refresh 요청을 전송함. 안되면 toast로 "로그인 필요" 알림
                     */
                }
                else {
                    isRefreshRequired = true;
                }
                if (!isRefreshRequired) return [3 /*break*/, 2];
                request = new AsyncRequestBuilder_1.AsyncRequestBuilder(DefaultAxiosFactory_1.DefaultAxiosFactory.createDefaultAxiosInstance(), null);
                console.debug("refresh 요청 전송됨...");
                return [4 /*yield*/, request.post("/refresh")
                        .actions({
                        TOKEN_NOT_FOUND: TOKEN_NOT_FOUND // refreshTokenUUID 쿠키가 없는 경우 -> 세션 없음
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
function TOKEN_NOT_FOUND() {
    ToastProvider_1.triggerToast({
        title: "로그인이 필요합니다",
        action: {
            description: "로그인하러 가기",
            onClick: function () { console.log("로그인 페이지로 이동"); }
        }
    });
}
exports["default"] = ensureValidAccessToken;
