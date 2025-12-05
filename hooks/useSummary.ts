import axios from "axios";

const useSummaryHook = () => {
  async function getSummary({
    userId,
    type,
  }: {
    userId: string;
    type: string;
  }) {
    try {
      const response = await axios.get(`/api/trading-summary`, {
        params: { userId, type },
      });
      return { data: response.data.data, error: response.data.error };
    } catch (error) {
      console.error("Error updating account:", error);
      return { data: null, error: error };
    }
  }

  return {
    getSummary,
  };
};

export default useSummaryHook;
