'use client';
"use strict";
exports.__esModule = true;
exports.useRootAuth = exports.SESSION_FLAG_NAME = void 0;
var zustand_1 = require("zustand");
var ToastProvider_1 = require("../toast/ToastProvider");
exports.SESSION_FLAG_NAME = "_pageflowSessionExpiredAt";
function isAuthenticated() {
    if (!isClient()) {
        return false;
    }
    var sessionFlag = getLocalStorage().getItem(exports.SESSION_FLAG_NAME);
    // [1]: 세션지표가 존재하지 않는 경우 -> refreshToken 쿠키는 존재할 수도 있지만, 모르겠고 그냥 세션 없는걸로 간주
    if (sessionFlag) {
        return false;
    }
    // [2]: 세션지표가 존재하지만, 만료된 경우 -> 세션 없음
    var isSessionExpired = Number(sessionFlag) < Date.now();
    if (isSessionExpired) {
        return false;
    }
    // [3]: 세션지표가 존재하고, 만료되지 않은 경우 -> 세션 있음
    return true;
}
function login() {
    if (!isClient()) {
        ToastProvider_1.triggerToast({
            title: "로그인할 수 없습니다.",
            description: "잠시후에 다시 시도해주세요.",
            variant: "destructive"
        });
        return;
    }
    var expiredAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30일
    localStorage.setItem(exports.SESSION_FLAG_NAME, String(expiredAt));
}
function logout() {
    if (!isClient()) {
        ToastProvider_1.triggerToast({
            title: "로그아웃할 수 없습니다.",
            description: "잠시후에 다시 시도해주세요.",
            variant: "destructive"
        });
        return;
    }
    localStorage.removeItem(exports.SESSION_FLAG_NAME);
}
function getLocalStorage() {
    return window.localStorage;
}
function isClient() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}
exports.useRootAuth = zustand_1.create(function (set, get) { return ({
    isAuthenticated: isAuthenticated(),
    login: function () {
        login();
        set({ isAuthenticated: true });
    },
    logout: function () {
        logout();
        set({ isAuthenticated: false });
    }
}); });
