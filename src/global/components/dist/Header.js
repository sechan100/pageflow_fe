'use client';
"use strict";
exports.__esModule = true;
var ThemeSwitcher_1 = require("@/global/components/ThemeSwitcher");
var UserWidget_1 = require("../../bounded-context/user/components/loginUserMenu/UserWidget");
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
var button_1 = require("@/components/ui/button");
var Entrypoint_1 = require("../../bounded-context/user/components/entrypoint/Entrypoint");
var useSession_1 = require("@/bounded-context/user/hook/useSession");
function Header() {
    var isAuthenticated = useSession_1.useSession().isAuthenticated;
    return (React.createElement("header", { className: "flex justify-between items-center container mt-5" },
        React.createElement(Title, null),
        React.createElement("div", { className: "flex items-center" },
            isAuthenticated ?
                // 로그인
                React.createElement(React.Fragment, null,
                    React.createElement(WriteLinkBtn, null),
                    React.createElement(UserWidget_1["default"], { className: "mx-2" })) :
                // 비회원
                React.createElement(React.Fragment, null,
                    React.createElement(Entrypoint_1["default"], { className: "mx-2" })),
            React.createElement(ThemeSwitcher_1.ThemeSwitcher, null))));
}
exports["default"] = Header;
function Title() {
    return (React.createElement("h1", { className: "text-3xl py-3" },
        React.createElement("a", { href: "/" }, "Pageflow")));
}
function WriteLinkBtn() {
    return (React.createElement(link_1["default"], { href: "/book/write" },
        React.createElement(button_1.Button, { variant: "outline", className: "rounded-full" },
            React.createElement(lucide_react_1.PencilLine, { className: "mr-1" }),
            " \uC9D1\uD544\uD558\uAE30")));
}
