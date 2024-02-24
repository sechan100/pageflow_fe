"use strict";
exports.__esModule = true;
exports.triggerToast = exports.TOAST_EVENT_NAME = void 0;
var toast_1 = require("@/components/ui/toast");
var toaster_1 = require("@/components/ui/toaster");
var use_toast_1 = require("@/components/ui/use-toast");
var EventEmitter_1 = require("@/libs/event/EventEmitter");
exports.TOAST_EVENT_NAME = "triggerToastEvent";
function ToastProvider(_a) {
    var children = _a.children;
    var toast = use_toast_1.useToast().toast;
    var event = EventEmitter_1["default"].getInstance();
    event.on(exports.TOAST_EVENT_NAME, function (toastContext) {
        toast({
            variant: toastContext.variant ? toastContext.variant : "default",
            title: toastContext.title ? toastContext.title : undefined,
            description: toastContext.description ? toastContext.description : undefined,
            action: toastContext.action
                ? React.createElement(toast_1.ToastAction, { altText: "Toast Action", onClick: toastContext.action.onClick }, toastContext.action.description)
                : undefined
        });
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(toaster_1.Toaster, null),
        children));
}
exports["default"] = ToastProvider;
function triggerToast(toastContext) {
    EventEmitter_1["default"].getInstance().emit(exports.TOAST_EVENT_NAME, toastContext);
}
exports.triggerToast = triggerToast;
