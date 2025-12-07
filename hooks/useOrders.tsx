"use client";

import { Order, OrderNotes, OrderTabs } from "@/types";
import {
  ORDER_DELETED_SUCCESSFULLY,
  ORDER_NOT_DELETED,
  ORDER_NOT_PLACED,
  ORDER_NOT_UPDATED,
  ORDERS_NOT_FETCHED,
} from "@/constants/toastMessages";
import toast from "react-hot-toast";
import useOrders from "@/store/useOrders";
import axios from "axios";

const useOrdersHook = () => {
  const { setOrders, setLoading } = useOrders();

  async function saveOrder(order: Order, onSuccess?: () => void) {
    try {
      await axios.post("/api/orders", { order });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error(ORDER_NOT_PLACED);
    }
  }

  async function updateOrder(order: Order | OrderNotes, onSuccess?: () => void) {
    try {
      await axios.put("/api/orders", { order });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(ORDER_NOT_UPDATED);
    }
  }

  async function deleteOrder(orderId: string, onSuccess?: () => void) {
    try {
      await axios.delete("/api/orders", {
        params: { orderId },
      });

      toast.success(ORDER_DELETED_SUCCESSFULLY);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(ORDER_NOT_DELETED);
    }
  }

  async function getAllOrders(
    userId: string,
    page = 1,
    limit = 10,
    status: OrderTabs = "open",
  ) {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders", {
        params: { userId, page, limit, status },
      });

      setOrders(response.data.data);
      return response.data.pagination;
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(ORDERS_NOT_FETCHED);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    saveOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
  };
};

export default useOrdersHook;
