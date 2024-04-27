import { ToastAction } from "@/shared/components/shadcn/toast";
import { Toaster } from "@/shared/components/shadcn/toaster";
import { useToast } from "@/shared/components/shadcn/use-toast";
import EventEmitter from "@/shared/libs/EventEmitter";




export interface ToastCmd {
  variant?: "default" | "destructive";
  title?: string;
  description?: string;
  action?: {
    description: string;
    onClick: () => void;
  }
}

export const TOAST_EVENT_NAME = "triggerToastEvent";

export default function ToastProvider({ children }: { children: React.ReactNode; }) {

  const { toast } = useToast();
  const event: EventEmitter = EventEmitter.getInstance();

  event.on(TOAST_EVENT_NAME, (toastContext: ToastCmd) => {
    toast({
      variant: toastContext.variant ? toastContext.variant : "default",
      title: toastContext.title ? toastContext.title : undefined,
      description: toastContext.description ? toastContext.description : undefined,
      action: toastContext.action
              ? <ToastAction 
                altText="Toast Action" 
                onClick={toastContext.action.onClick}>
                  {toastContext.action.description}
                </ToastAction> 
              : undefined
    });
  });

  return (
    <>
      <Toaster />
      {children}
    </>
  );
}


export function popToast(toastContext: ToastCmd){
  EventEmitter.getInstance().emit(TOAST_EVENT_NAME, toastContext);
}