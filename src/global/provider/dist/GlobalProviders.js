'use client';
"use strict";
exports.__esModule = true;
var ThemeProvider_1 = require("@/global/provider/ThemeProvider");
var AsyncRequestBuilder_1 = require("@/global/api/AsyncRequestBuilder");
var ToastProvider_1 = require("@/global/provider/ToastProvider");
var react_1 = require("react");
var ReactQueryProvider_1 = require("./ReactQueryProvider");
function GlobalProviders(_a) {
    var children = _a.children;
    react_1.useEffect(function () {
        var handleRejection = function (event) {
            var reason = event.reason;
            // CodeActions에 의해서 이미 처리된 Promise인 경우 무시
            if (reason instanceof AsyncRequestBuilder_1.RejectedForCodeActionCall) {
                // console.debug(`[GlobalProviders]: unhandledrejection 이벤트 핸들러에서 apiCode [${reason.name}]로 인해 reject된 Promise를 진압하여 처리함.`);
                event.preventDefault();
                return;
            }
        };
        // 거부된 프로미스 처리 로직
        window.addEventListener('unhandledrejection', handleRejection);
        return function () {
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);
    return (React.createElement(ThemeProvider_1.ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true },
        React.createElement(ReactQueryProvider_1["default"], null,
            React.createElement(ToastProvider_1["default"], null, children))));
}
exports["default"] = GlobalProviders;
