import { Order } from "@/types";
import { create } from "zustand";



type Store = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
};

const useOrders = create<Store>()((set) => ({
  orders: [],
  setOrders: (orders: Order[]) => set(() => ({ orders })),
}));

export default useOrders;
