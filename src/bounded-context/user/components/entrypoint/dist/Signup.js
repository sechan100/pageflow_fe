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
var signup_1 = require("@/bounded-context/user/api/signup");
function SignupTrigger(_a) {
    var className = _a.className;
    return (React.createElement("div", { className: className },
        React.createElement(dialog_1.Dialog, { modal: true },
            React.createElement(dialog_1.DialogTrigger, { asChild: true },
                React.createElement(button_1.Button, { className: "rounded-full" }, "\uD68C\uC6D0\uAC00\uC785")),
            React.createElement(dialog_1.DialogContent, null,
                React.createElement(SignupDialogForm, null)))));
}
exports["default"] = SignupTrigger;
function SignupDialogForm() {
    // Zod 스키마 정의
    var signupFormSchema = zod_1.z.object({
        // username
        username: UserSchemata_1.zodUserSchemata.username,
        // password
        passwordSchema: zod_1.z.object({
            password: UserSchemata_1.zodUserSchemata.password,
            passwordConfirm: zod_1.z.string()
        })
            .refine(function (data) { return (data.password === data.passwordConfirm); }, {
            message: "비밀번호 확인이 일치하지 않습니다.",
            path: ["passwordConfirm"]
        }),
        // email
        email: zod_1.z.string().email(),
        // penname
        penname: UserSchemata_1.zodUserSchemata.penname
    });
    var signupForm = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(signupFormSchema),
        defaultValues: {
            username: "testuser1",
            passwordSchema: {
                password: "testuser1",
                passwordConfirm: "testuser1"
            },
            email: "testuser1@pageflow.org",
            penname: "테스트유저일"
        }
    });
    function onSubmit(values) {
        var signupForm = {
            username: values.username,
            password: values.passwordSchema.password,
            email: values.email,
            penname: values.penname,
            profileImgUrl: null
        };
        signup_1["default"](signupForm);
    }
    return (React.createElement(form_1.Form, __assign({}, signupForm),
        React.createElement("form", { id: "signup_form", onSubmit: signupForm.handleSubmit(onSubmit), className: "space-y-2" },
            React.createElement(form_1.FormField, { control: signupForm.control, name: "username", render: function (_a) {
                    var field = _a.field;
                    return (React.createElement(form_1.FormItem, null,
                        React.createElement(form_1.FormLabel, { className: "text-white" }, "\uC544\uC774\uB514"),
                        React.createElement(form_1.FormControl, null,
                            React.createElement(input_1.Input, __assign({ placeholder: "username" }, field))),
                        React.createElement(form_1.FormMessage, null)));
                } }),
            React.createElement(form_1.FormField, { control: signupForm.control, name: "passwordSchema.password", render: function (_a) {
                    var field = _a.field;
                    return (React.createElement(form_1.FormItem, null,
                        React.createElement(form_1.FormLabel, { className: "text-white" }, "\uBE44\uBC00\uBC88\uD638"),
                        React.createElement(form_1.FormControl, null,
                            React.createElement(input_1.Input, __assign({ type: "password", placeholder: "password" }, field))),
                        React.createElement(form_1.FormMessage, null)));
                } }),
            React.createElement(form_1.FormField, { control: signupForm.control, name: "passwordSchema.passwordConfirm", render: function (_a) {
                    var field = _a.field;
                    return (React.createElement(form_1.FormItem, null,
                        React.createElement(form_1.FormLabel, { className: "text-white" }, "\uBE44\uBC00\uBC88\uD638 \uD655\uC778"),
                        React.createElement(form_1.FormControl, null,
                            React.createElement(input_1.Input, __assign({ type: "password", placeholder: "passwordConfirm" }, field))),
                        React.createElement(form_1.FormMessage, null)));
                } }),
            React.createElement(form_1.FormField, { control: signupForm.control, name: "email", render: function (_a) {
                    var field = _a.field;
                    return (React.createElement(form_1.FormItem, null,
                        React.createElement(form_1.FormLabel, { className: "text-white" }, "\uC774\uBA54\uC77C"),
                        React.createElement(form_1.FormControl, null,
                            React.createElement(input_1.Input, __assign({ type: "email", placeholder: "email" }, field))),
                        React.createElement(form_1.FormMessage, null)));
                } }),
            React.createElement(form_1.FormField, { control: signupForm.control, name: "penname", render: function (_a) {
                    var field = _a.field;
                    return (React.createElement(form_1.FormItem, null,
                        React.createElement(form_1.FormLabel, { className: "text-white" }, "\uD544\uBA85"),
                        React.createElement(form_1.FormControl, null,
                            React.createElement(input_1.Input, __assign({ type: "penname", placeholder: "penname" }, field))),
                        React.createElement(form_1.FormMessage, null)));
                } })),
        React.createElement(button_1.Button, { form: "signup_form", type: "submit", className: "rounded-full" }, "\uD68C\uC6D0\uAC00\uC785")));
}
