"use client";

import { Order } from "@/types";
import {
  ORDER_DELETED_SUCCESSFULLY,
  ORDER_NOT_DELETED,
  ORDER_NOT_PLACED,
  ORDER_NOT_UPDATED,
  ORDER_PLACED_SUCCESSFULLY,
  ORDER_SQUARED_OFF,
  ORDER_UPDATED_SUCCESSFULLY,
  ORDERS_NOT_FETCHED,
} from "@/constants/toastMessages";
import toast from "react-hot-toast";
import useOrders from "@/store/useOrders";
import axios from "axios";

const useOrdersHook = () => {
  const { setOrders } = useOrders();

  async function saveOrder(order: Order, onSuccess?: () => void) {
    try {
      await axios.post("/api/orders", { order });

      toast.success(ORDER_PLACED_SUCCESSFULLY);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error(ORDER_NOT_PLACED);
    }
  }

  async function updateOrder(order: Order, onSuccess?: () => void) {
    try {
      await axios.put("/api/orders", { order });

      toast.success(
        order.status === "closed"
          ? ORDER_SQUARED_OFF
          : ORDER_UPDATED_SUCCESSFULLY,
      );
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

  async function getAllOrders(userId: string, page = 1, limit = 10) {
    try {
      const response = await axios.get("/api/orders", {
        params: { userId, page, limit },
      });

      setOrders(response.data.data);
      return response.data.pagination;
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(ORDERS_NOT_FETCHED);
      return null;
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
