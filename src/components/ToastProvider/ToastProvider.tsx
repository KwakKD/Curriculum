import { type ReactNode, useEffect, useRef, useState } from "react";
import { setToastFunction, type ToastOptions, type ToastType } from "../../utils/toast";

type ToastState = { msg: string; type: ToastType; duration: number } | null;

const styleByType: Record<ToastType, { bg: string; border: string }> = {
    success: { bg: "#0ea5e9", border: "#0284c7" }, // 청록 느낌
    error:   { bg: "#ef4444", border: "#b91c1c" },
    info:    { bg: "#374151", border: "#111827" },
    warning: { bg: "#f59e0b", border: "#b45309" },
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastState>(null);
    const timerRef = useRef<number | null>(null);

    const showToast = (msg: string, opts?: ToastOptions) => {
        const type = opts?.type ?? "info";
        const duration = Math.max(800, opts?.duration ?? 3000);

        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        setToast({ msg, type, duration });
        timerRef.current = window.setTimeout(() => setToast(null), duration);
    };

    useEffect(() => {
        setToastFunction(showToast);
        return () => setToastFunction(() => {});
    }, []);

    const style = toast ? styleByType[toast.type] : null;

    return (
        <>
            {children}
            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        position: "fixed",
                        bottom: 30,
                        // top: 20,
                        // right: 20,
                        left: '40%',
                        //maxWidth: 360,
                        background: style!.bg,
                        color: "#fff",
                        padding: "12px 16px",
                        borderRadius: 8,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                        border: `1px solid ${style!.border}`,
                        fontSize: 14,
                        lineHeight: 1.4,
                        transition: "transform 0.2s ease, opacity 0.3s ease",
                    }}
                >
                    {toast.msg}
                </div>
            )}
        </>
    );
}