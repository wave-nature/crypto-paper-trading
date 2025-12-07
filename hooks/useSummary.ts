import useAuthStore from "@/store/useAuthStore";
import useSummary from "@/store/useSummary";
import axios from "axios";

const useSummaryHook = () => {
  const { user } = useAuthStore();
  const { setLoader, setSummary } = useSummary();
  async function getSummary({ type }: { type: string }) {
    try {
      setLoader(true);
      const response = await axios.get(`/api/trading-summary`, {
        params: { userId: user?.id, type },
      });
      const payload = { data: response.data.data, error: response.data.error };
      if (payload.error) {
        throw new Error(payload.error);
      }
      setSummary(payload.data);
    } catch (error) {
      console.error("Error updating account:", error);
    } finally {
      setLoader(false);
    }
  }

  return {
    getSummary,
  };
};

export default useSummaryHook;
