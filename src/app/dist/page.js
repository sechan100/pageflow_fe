'use client';
"use strict";
exports.__esModule = true;
var button_1 = require("@/components/ui/button");
var react_1 = require("react");
var GlobalProviders_1 = require("../global/components/GlobalProviders");
function Home() {
    var _a = react_1.useContext(GlobalProviders_1.SessionContext), sessionManager = _a.sessionManager, api = _a.api;
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "\uBA54\uC778 \uD398\uC774\uC9C0"),
        React.createElement(button_1.Button, { onClick: function () { api.get("/user/me").execute(); } }, "Authorization \uD5E4\uB354\uB97C \uD3EC\uD568\uD55C \uC694\uCCAD\uC744 \uC804\uC1A1\uD558\uAE30!")));
}
exports["default"] = Home;
