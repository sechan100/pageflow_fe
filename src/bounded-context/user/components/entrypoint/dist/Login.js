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
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var zod_1 = require("zod");
var zod_2 = require("@hookform/resolvers/zod");
var react_hook_form_1 = require("react-hook-form");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var UserSchemata_1 = require("@/bounded-context/user/constants/zod/UserSchemata");
var useApi_1 = require("@/global/hook/useApi");
var useAuth_1 = require("@/global/hook/useAuth");
var ToastProvider_1 = require("@/global/toast/ToastProvider");
var useRootAuth_1 = require("@/global/hook/useRootAuth");
function LoginTrigger(_a) {
    var className = _a.className;
    return (React.createElement("div", { className: className },
        React.createElement(dialog_1.Dialog, { modal: true },
            React.createElement(dialog_1.DialogTrigger, { asChild: true },
                React.createElement(button_1.Button, { className: "rounded-full" }, "\uB85C\uADF8\uC778")),
            React.createElement(dialog_1.DialogContent, null,
                React.createElement(LoginDialogForm, null)))));
}
exports["default"] = LoginTrigger;
function LoginDialogForm() {
    var api = useApi_1.useApi().api;
    var storeToken = useAuth_1.useAuth().storeToken;
    var login = useRootAuth_1.useRootAuth().login;
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
    function onSubmit(UnAndPw) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api
                            .anonymous()
                            .post("/login")
                            .actions({
                            USER_NOT_FOUND: USER_NOT_FOUND
                        })
                            .data(UnAndPw)
                            .fetch()];
                    case 1:
                        accessToken = _a.sent();
                        // 토큰 저장
                        storeToken(accessToken);
                        login();
                        return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement(form_1.Form, __assign({}, loginForm),
        React.createElement("form", { id: "login_form", onSubmit: loginForm.handleSubmit(onSubmit), className: "space-y-2" },
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
function USER_NOT_FOUND() {
    ToastProvider_1.triggerToast({
        title: "존재하지 않는 사용자입니다.",
        action: {
            description: "회원가입하러 가기",
            onClick: function () { console.log("회원가입 페이지로 이동합니다."); }
        }
    });
}
