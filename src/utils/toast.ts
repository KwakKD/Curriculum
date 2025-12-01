export type ToastType = "success" | "error" | "info" | "warning";

export type ToastOptions = {
    type?: ToastType;
    duration?: number;
};

let showToastFn: ((msg: string, opts?: ToastOptions) => void) | null = null;

export function setToastFunction(fn: (msg: string, opts?: ToastOptions) => void) {
    showToastFn = fn;
}

export function toast(msg: string, opts?: ToastOptions) {
    if (showToastFn) showToastFn(msg, opts);
    else console.warn("Toast function is not initialized yet.");
}

toast.success = (msg: string, opts?: Omit<ToastOptions, "type">) =>
    toast(msg, { ...opts, type: "success" });

toast.error = (msg: string, opts?: Omit<ToastOptions, "type">) =>
    toast(msg, { ...opts, type: "error" });

toast.info = (msg: string, opts?: Omit<ToastOptions, "type">) =>
    toast(msg, { ...opts, type: "info" });

toast.warning = (msg: string, opts?: Omit<ToastOptions, "type">) =>
    toast(msg, { ...opts, type: "warning" });