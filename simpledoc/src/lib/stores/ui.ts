/**
 * UI Store - Управление UI состоянием
 */

import { writable, derived } from 'svelte/store';
import type { UIState, Notification, KeyboardShortcut } from '$lib/types';

// ============================================================================
// Начальное состояние
// ============================================================================

const initialUIState: UIState = {
  // Panels
  leftPanelOpen: true,
  leftPanelWidth: 280,
  rightPanelOpen: true,
  rightPanelWidth: 320,
  
  // Ribbon
  ribbonCollapsed: false,
  activeRibbonTab: 'blocks',
  
  // Modals
  activeModal: null,
  modalData: null,
  
  // Loading
  isLoading: false,
  loadingMessage: null,
  
  // Notifications
  notifications: []
};

// ============================================================================
// Store
// ============================================================================

export const ui = writable<UIState>(initialUIState);

// ============================================================================
// UI Actions
// ============================================================================

export const uiActions = {
  /**
   * Панели
   */
  toggleLeftPanel: () => {
    ui.update(state => ({
      ...state,
      leftPanelOpen: !state.leftPanelOpen
    }));
  },
  
  setLeftPanelWidth: (width: number) => {
    ui.update(state => ({
      ...state,
      leftPanelWidth: Math.max(200, Math.min(500, width))
    }));
  },
  
  toggleRightPanel: () => {
    ui.update(state => ({
      ...state,
      rightPanelOpen: !state.rightPanelOpen
    }));
  },
  
  setRightPanelWidth: (width: number) => {
    ui.update(state => ({
      ...state,
      rightPanelWidth: Math.max(200, Math.min(500, width))
    }));
  },
  
  /**
   * Ribbon
   */
  toggleRibbon: () => {
    ui.update(state => ({
      ...state,
      ribbonCollapsed: !state.ribbonCollapsed
    }));
  },
  
  setActiveRibbonTab: (tab: string) => {
    ui.update(state => ({
      ...state,
      activeRibbonTab: tab
    }));
  },
  
  /**
   * Modals
   */
  openModal: (modalName: string, data?: any) => {
    ui.update(state => ({
      ...state,
      activeModal: modalName,
      modalData: data
    }));
  },
  
  closeModal: () => {
    ui.update(state => ({
      ...state,
      activeModal: null,
      modalData: null
    }));
  },
  
  /**
   * Loading
   */
  setLoading: (isLoading: boolean, message?: string) => {
    ui.update(state => ({
      ...state,
      isLoading,
      loadingMessage: message || null
    }));
  },
  
  /**
   * Notifications
   */
  showNotification: (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    description?: string,
    duration: number = 5000
  ) => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      message,
      description,
      duration,
      timestamp: new Date()
    };
    
    ui.update(state => ({
      ...state,
      notifications: [...state.notifications, notification]
    }));
    
    // Автоматически убираем через duration
    if (duration > 0) {
      setTimeout(() => {
        uiActions.removeNotification(notification.id);
      }, duration);
    }
  },
  
  removeNotification: (id: string) => {
    ui.update(state => ({
      ...state,
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  clearNotifications: () => {
    ui.update(state => ({
      ...state,
      notifications: []
    }));
  }
};

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

export const keyboardShortcuts: KeyboardShortcut[] = [
  // File
  { key: 'n', ctrl: true, action: 'new_document', description: 'New Document' },
  { key: 's', ctrl: true, action: 'save_document', description: 'Save Document' },
  { key: 'o', ctrl: true, action: 'open_document', description: 'Open Document' },
  { key: 'e', ctrl: true, action: 'export_document', description: 'Export Document' },
  
  // Edit
  { key: 'z', ctrl: true, action: 'undo', description: 'Undo' },
  { key: 'z', ctrl: true, shift: true, action: 'redo', description: 'Redo' },
  { key: 'c', ctrl: true, action: 'copy', description: 'Copy' },
  { key: 'x', ctrl: true, action: 'cut', description: 'Cut' },
  { key: 'v', ctrl: true, action: 'paste', description: 'Paste' },
  { key: 'd', ctrl: true, action: 'duplicate', description: 'Duplicate' },
  { key: 'a', ctrl: true, action: 'select_all', description: 'Select All' },
  
  // Blocks
  { key: 'Delete', action: 'delete_block', description: 'Delete Block' },
  { key: 'Backspace', action: 'delete_block', description: 'Delete Block' },
  { key: 'Escape', action: 'deselect', description: 'Deselect' },
  
  // View
  { key: '0', ctrl: true, action: 'zoom_reset', description: 'Reset Zoom' },
  { key: '=', ctrl: true, action: 'zoom_in', description: 'Zoom In' },
  { key: '-', ctrl: true, action: 'zoom_out', description: 'Zoom Out' },
  { key: 'g', ctrl: true, action: 'toggle_grid', description: 'Toggle Grid' },
  { key: 'r', ctrl: true, action: 'toggle_rulers', description: 'Toggle Rulers' },
  
  // Navigation
  { key: 'ArrowUp', ctrl: true, action: 'bring_forward', description: 'Bring Forward' },
  { key: 'ArrowDown', ctrl: true, action: 'send_backward', description: 'Send Backward' },
  { key: 'ArrowUp', ctrl: true, shift: true, action: 'bring_to_front', description: 'Bring to Front' },
  { key: 'ArrowDown', ctrl: true, shift: true, action: 'send_to_back', description: 'Send to Back' },
  
  // Panels
  { key: 'b', ctrl: true, action: 'toggle_left_panel', description: 'Toggle Block Panel' },
  { key: 'p', ctrl: true, action: 'toggle_right_panel', description: 'Toggle Properties Panel' }
];

// ============================================================================
// Derived Stores
// ============================================================================

export const hasNotifications = derived(
  ui,
  ($ui) => $ui.notifications.length > 0
);

export const isModalOpen = derived(
  ui,
  ($ui) => $ui.activeModal !== null
);

export const canvasWidth = derived(
  ui,
  ($ui) => {
    let width = 0;
    if ($ui.leftPanelOpen) width += $ui.leftPanelWidth;
    if ($ui.rightPanelOpen) width += $ui.rightPanelWidth;
    return width;
  }
);

