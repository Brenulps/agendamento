import type { Toast, ToastOptions } from '../../shared/types/Toast';

export function useToast() {
    const toasts = useState<Toast[]>('toasts', () => []);

    function generateId(): string {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    function show(message: string, options: ToastOptions = {}): void {
        const toast: Toast = {
            id: generateId(),
            variant: options.variant || 'info',
            title: options.title,
            message,
            duration: options.duration || 5000,
        };

        toasts.value.push(toast);
    }

    function success(message: string, title?: string): void {
        show(message, { variant: 'success', title });
    }

    function error(message: string, title?: string): void {
        show(message, { variant: 'error', title });
    }

    function warning(message: string, title?: string): void {
        show(message, { variant: 'warning', title });
    }

    function info(message: string, title?: string): void {
        show(message, { variant: 'info', title });
    }

    function remove(id: string): void {
        const index = toasts.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    }

    function clear(): void {
        toasts.value = [];
    }

    return {
        toasts: readonly(toasts),
        show,
        success,
        error,
        warning,
        info,
        remove,
        clear,
    };
}
