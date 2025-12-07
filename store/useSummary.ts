import { create } from "zustand";

interface Summary {}

type SettingsState = {
  summary: any;
  loader: boolean;
  setSummary: (summary: any) => void;
  setLoader: (value: boolean) => void;
};

const useSummary = create<SettingsState>()((set, get) => ({
  summary: {},
  loader: false,
  setSummary: (payload) =>
    set({
      summary: payload,
    }),
  setLoader: (value: boolean) =>
    set({
      loader: value,
    }),
}));

export default useSummary;
