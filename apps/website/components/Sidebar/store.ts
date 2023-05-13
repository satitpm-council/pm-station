import { create } from "zustand";

/**
 * Sidebar Zustand store to set state without wrapping contexts.
 */
export const sidebarStore = create(() => ({
  collapsed: false,
  toggled: false,
}));
