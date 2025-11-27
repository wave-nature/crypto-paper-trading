import axios from "axios";
import { get } from "react-hook-form";

const useAccountHook = () => {
  async function updateAccount(payload: {
    accountId: string;
    balance: number;
  }) {
    try {
      await axios.put("/api/accounts", payload);
    } catch (error) {
      console.error("Error updating account:", error);
    }
  }

  async function getAccount(userId: string) {
    try {
      const response = await axios.get(`/api/accounts`, { params: { userId } });
      return { data: response.data.data, error: response.data.error };
    } catch (error) {
      console.error("Error fetching account:", error);
      return { data: null, error: error };
    }
  }

  return {
    updateAccount,
    getAccount,
  };
};

export default useAccountHook;
