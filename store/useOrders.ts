import { Order } from "@/types";
import { create } from "zustand";

type Store = {
  loading: boolean;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
};

const useOrders = create<Store>()((set) => ({
  loading: false,
  orders: [],
  setOrders: (orders: Order[]) => set(() => ({ orders })),
  setLoading: (loading: boolean) => set(() => ({ loading })),
}));

export default useOrders;
