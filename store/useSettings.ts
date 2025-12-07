import { create } from "zustand";

interface Settings {
  enableScreenshot: boolean;
}

type SettingsState = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

const useSettings = create<SettingsState>()((set, get) => ({
  settings: { enableScreenshot: false },
  setSettings: ({ enableScreenshot }) =>
    set({
      settings: {
        enableScreenshot,
      },
    }),
}));

export default useSettings;
