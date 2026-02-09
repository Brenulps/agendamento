export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
    id: string;
    variant: ToastVariant;
    title?: string;
    message: string;
    duration?: number;
}

export interface ToastOptions {
    variant?: ToastVariant;
    title?: string;
    duration?: number;
}
