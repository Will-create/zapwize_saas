import { create } from 'zustand';

type AlertState = {
  isVisible: boolean;
  message: string;
  severity: 'success' | 'warning' | 'error' | 'info';
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number;
  countdown: number;
  timeoutId?: number;
  intervalId?: number;
  show: (
    message: string,
    severity: AlertState['severity'],
    action?: AlertState['action'],
    duration?: number
  ) => void;
  hide: () => void;
};

export const useAlertStore = create<AlertState>((set, get) => ({
  isVisible: false,
  message: '',
  severity: 'info',
  action: undefined,
  duration: undefined,
  countdown: 0,
  timeoutId: undefined,
  intervalId: undefined,

  show: (message, severity, action, duration) => {
    const { timeoutId, intervalId } = get();
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);

    set({
      isVisible: true,
      message,
      severity,
      action,
      duration,
      countdown: duration || 0,
    });

    if (duration) {
      const newIntervalId = setInterval(() => {
        set((state) => ({ countdown: state.countdown > 0 ? state.countdown - 1 : 0 }));
      }, 1000);

      const newTimeoutId = setTimeout(() => {
        get().hide();
      }, duration * 1000);

      set({ timeoutId: newTimeoutId as any, intervalId: newIntervalId as any });
    }
  },

  hide: () => {
    const { timeoutId, intervalId } = get();
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);
    set({ isVisible: false, timeoutId: undefined, intervalId: undefined });
  },
}));