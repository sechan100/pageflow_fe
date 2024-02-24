'use client';
"use strict";
exports.__esModule = true;
exports.useAuth = exports.SESSION_FLAG_NAME = void 0;
var zustand_1 = require("zustand");
exports.SESSION_FLAG_NAME = "_pageflowSessionExpiredAt";
function isAuthenticated() {
    var isAuthenticated = continueIfOnServer(function () {
        var sessionFlag = getLocalStorage().getItem(exports.SESSION_FLAG_NAME);
        // [1]: 세션지표가 존재하지 않는 경우 -> refreshToken 쿠키는 존재할 수도 있지만, 모르겠고 그냥 세션 없는걸로 간주
        if (!sessionFlag) {
            return false;
        }
        // [2]: 세션지표가 존재하지만, 만료된 경우 -> 세션 없음
        var isSessionExpired = Number(sessionFlag) < Date.now();
        if (isSessionExpired) {
            return false;
        }
        // [3]: 세션지표가 존재하고, 만료되지 않은 경우 -> 세션 있음
        return true;
    });
    console.debug("LocalStorage에서 ROOT 인증상태를 불러옴: ", isAuthenticated);
    return isAuthenticated;
}
function authenticate() {
    continueIfOnServer(function () {
        var expiredAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30일
        localStorage.setItem(exports.SESSION_FLAG_NAME, String(expiredAt));
    });
}
function deAuthenticate() {
    continueIfOnServer(function () { return localStorage.removeItem(exports.SESSION_FLAG_NAME); });
}
function getLocalStorage() {
    return window.localStorage;
}
function continueIfOnServer(callback) {
    while (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        return callback();
    }
}
exports.useAuth = zustand_1.create(function (set, get) { return ({
    isAuthenticated: isAuthenticated(),
    authenticate: function () {
        authenticate();
        set({ isAuthenticated: true });
    },
    deAuthenticate: function () {
        deAuthenticate();
        set({ isAuthenticated: false });
    }
}); });
