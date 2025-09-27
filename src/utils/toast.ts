export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: ((toasts: Toast[]) => void)[] = [];

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  add(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    };

    this.toasts.push(newToast);
    this.notify();

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }

    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }

  success(title: string, message?: string) {
    return this.add({ type: "success", title, message });
  }

  error(title: string, message?: string) {
    return this.add({ type: "error", title, message });
  }

  warning(title: string, message?: string) {
    return this.add({ type: "warning", title, message });
  }

  info(title: string, message?: string) {
    return this.add({ type: "info", title, message });
  }
}

export const toast = new ToastManager();
