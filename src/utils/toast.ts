import toast, { ToastOptions } from 'react-hot-toast';

/**
 * Enhanced toast utility that prevents toast stacking
 * by dismissing previous toasts before showing a new one.
 */
export const notify = {
    success: (message: string, options?: ToastOptions) => {
        toast.dismiss();
        return toast.success(message, options);
    },
    error: (message: string, options?: ToastOptions) => {
        toast.dismiss();
        return toast.error(message, options);
    },
    loading: (message: string, options?: ToastOptions) => {
        toast.dismiss();
        return toast.loading(message, options);
    },
    dismiss: () => toast.dismiss(),
};

export default notify;
