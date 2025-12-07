import { updated } from "@/constants/toastMessages";
import axios from "axios";
import toast from "react-hot-toast";

const useSettingsHook = () => {
  async function updateSettings(
    {
      userId,
      enableScreenshot,
    }: {
      userId: string;
      enableScreenshot: boolean;
    },
    onSuccess?: () => void,
  ) {
    try {
      const payload: any = {
        user_id: userId,
        enable_screenshot: enableScreenshot,
      };

      const response = await axios.patch(`/api/settings`, payload);
      toast.success(updated("Settings"));
      if (onSuccess) {
        onSuccess();
      }
      return { data: response.data.data, error: response.data.error };
    } catch (error) {
      console.error("Error updating account:", error);
      return { data: null, error: error };
    }
  }

  async function getSettings(userId: string) {
    try {
      const response = await axios.get(`/api/settings`, {
        params: { userId },
      });
      return { data: response.data.data, error: response.data.error };
    } catch (error) {
      console.error("Error updating account:", error);
      return { data: null, error: error };
    }
  }

  return {
    updateSettings,
    getSettings,
  };
};

export default useSettingsHook;
