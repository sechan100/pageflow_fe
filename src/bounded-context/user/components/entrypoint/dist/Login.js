'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var zod_1 = require("zod");
var zod_2 = require("@hookform/resolvers/zod");
var react_hook_form_1 = require("react-hook-form");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var UserSchemata_1 = require("@/bounded-context/user/constants/zod/UserSchemata");
var OAuth2LoginWidget_1 = require("./OAuth2LoginWidget");
var useSession_1 = require("../../hook/useSession");
function LoginTrigger(_a) {
    var className = _a.className;
    return (React.createElement("div", { className: className },
        React.createElement(dialog_1.Dialog, { modal: true },
            React.createElement(dialog_1.DialogTrigger, { asChild: true },
                React.createElement(button_1.Button, { className: "rounded-full" }, "\uB85C\uADF8\uC778")),
            React.createElement(dialog_1.DialogContent, null,
                React.createElement(LoginDialogForm, null),
                React.createElement(OAuth2LoginWidget_1["default"], null)))));
}
exports["default"] = LoginTrigger;
function LoginDialogForm() {
    var formLogin = useSession_1.useSession().formLogin;
    var loginFormSchema = zod_1.z.object({
        username: UserSchemata_1.zodUserSchemata.username,
        password: UserSchemata_1.zodUserSchemata.password
    });
    var loginForm = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(loginFormSchema),
        defaultValues: {
            username: "testuser1",
            password: "testuser1"
        }
    });
    return (React.createElement(form_1.Form, __assign({}, loginForm),
        React.createElement("form", { id: "login_form", onSubmit: loginForm.handleSubmit(function (_a) {
                var username = _a.username, password = _a.password;
                // form 제출 시 로그인 함수 실행
                formLogin(username, password);
            }), className: "space-y-2" },
            React.createElement(form_1.FormField, { control: loginForm.control, name: "username", render: function (_a) {
                    var field = _a.field;
                    return (React.createElement(form_1.FormItem, null,
                        React.createElement(form_1.FormLabel, { className: "text-white" }, "\uC544\uC774\uB514"),
                        React.createElement(form_1.FormControl, null,
                            React.createElement(input_1.Input, __assign({ placeholder: "username" }, field))),
                        React.createElement(form_1.FormMessage, null)));
                } }),
            React.createElement(form_1.FormField, { control: loginForm.control, name: "password", render: function (_a) {
                    var field = _a.field;
                    return (React.createElement(form_1.FormItem, null,
                        React.createElement(form_1.FormLabel, { className: "text-white" }, "\uBE44\uBC00\uBC88\uD638"),
                        React.createElement(form_1.FormControl, null,
                            React.createElement(input_1.Input, __assign({ type: "password", placeholder: "password" }, field))),
                        React.createElement(form_1.FormMessage, null)));
                } })),
        React.createElement(button_1.Button, { form: "login_form", type: "submit", className: "rounded-full" }, "\uB85C\uADF8\uC778")));
}
