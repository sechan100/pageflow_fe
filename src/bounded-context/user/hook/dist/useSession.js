"use strict";
exports.__esModule = true;
exports.useSession = void 0;
var react_query_1 = require("react-query");
var ReactQueryKey_1 = require("../constants/query-key/ReactQueryKey");
var useApi_1 = require("@/global/hook/useApi");
var useRootAuth_1 = require("../../../global/hook/useRootAuth");
exports.useSession = function () {
    var _a = useApi_1.useApi(), api = _a.api, apiCode = _a.apiCode;
    var isAuthenticated = useRootAuth_1.useRootAuth().isAuthenticated;
    var queryKey = ReactQueryKey_1.QueryKeys.user.session;
    var queryFn = function () { return api.get("/user/session").actions({}).fetch(); };
    var options = {
        enabled: isAuthenticated
    };
    // [1]: useQuery를 사용하여 세션 정보를 가져오고 캐싱, 반환
    var useQueryResult = react_query_1.useQuery(queryKey, queryFn, options);
    // ServerSession 타입을 ClientSession 타입으로 변환
    var session = useQueryResult.data ? convert(useQueryResult.data) : anonymousSession();
    return {
        session: session,
        apiCode: apiCode,
        useQueryResult: useQueryResult
    };
};
var convert = function (serverSession) {
    return {
        isAuthenticated: true,
        user: serverSession.user
    };
};
var anonymousSession = function () {
    return {
        isAuthenticated: false,
        user: null
    };
};
