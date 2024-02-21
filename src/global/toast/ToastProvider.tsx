import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import EventEmitter from "@/libs/event/EventEmitter";




interface ToastContext {
  variant?: "default" | "destructive";
  title: string;
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

  event.on(TOAST_EVENT_NAME, (toastContext: ToastContext) => {
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


export function triggerToast(toastContext: ToastContext){
  EventEmitter.getInstance().emit(TOAST_EVENT_NAME, toastContext);
}