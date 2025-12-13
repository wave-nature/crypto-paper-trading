import { create } from "zustand";

type Sidebar = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
};

const useSidebar = create<Sidebar>()((set, get) => ({
  isSidebarOpen: true,
  setIsSidebarOpen: (value: boolean) => set({ isSidebarOpen: value }),
}));

export default useSidebar;
