'use client';
"use strict";
exports.__esModule = true;
exports.QueryClientContext = void 0;
var ThemeProvider_1 = require("@/global/theme/ThemeProvider");
var react_query_1 = require("react-query");
var AsyncRequestBuilder_1 = require("@/global/api/AsyncRequestBuilder");
var ToastProvider_1 = require("@/global/toast/ToastProvider");
var react_1 = require("react");
var queryClient = reactQueryConfig();
exports.QueryClientContext = react_1.createContext(queryClient);
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
        React.createElement(react_query_1.QueryClientProvider, { client: queryClient },
            React.createElement(exports.QueryClientContext.Provider, { value: queryClient },
                React.createElement(ToastProvider_1["default"], null, children)))));
}
exports["default"] = GlobalProviders;
// react-query
function reactQueryConfig() {
    // react-query 전역 객체
    var queryClient = new react_query_1.QueryClient({
        defaultOptions: {
            queries: {
                refetchOnMount: false,
                refetchOnWindowFocus: false,
                retry: false,
                staleTime: 1000 * 60 * 60 // staleTime 1시간
            }
        }
    });
    return queryClient;
}
