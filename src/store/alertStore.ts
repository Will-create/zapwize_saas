import { create } from 'zustand';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertAction {
  label: string;
  onPress: () => void;
}

interface AlertState {
  visible: boolean;
  message: string;
  type: AlertType;
  action?: AlertAction;
  autoHideTimeout?: number; // in seconds
  show: (message: string, type: AlertType, action?: AlertAction, autoHideTimeout?: number) => void;
  hide: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  action: undefined,
  autoHideTimeout: undefined,
  
  show: (message, type, action, autoHideTimeout) => 
    set({ visible: true, message, type, action, autoHideTimeout }),
  
  hide: () => set({ visible: false })
}));