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
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";
import useOrders from "@/store/useOrders";

const useOrdersHook = () => {
  const supabase = createSupabaseBrowserClient();
  const { user } = useAuthStore();
  const { setOrders } = useOrders();

  async function saveOrder(order: Order) {
    const { error } = await supabase.from("orders").insert(order);

    if (error) {
      console.error("Error saving order:", error);
      toast.error(ORDER_NOT_PLACED);
    } else {
      toast.success(ORDER_PLACED_SUCCESSFULLY);
      if (user) {
        getAllOrders(user?.id);
      }
    }
  }

  async function updateOrder(order: Order) {
    const { error } = await supabase
      .from("orders")
      .update(order)
      .eq("id", order.id);

    console.log("order", order);

    if (error) {
      console.error("Error updating order:", error);
      toast.error(ORDER_NOT_UPDATED);
    } else {
      toast.success(
        order.status === "closed"
          ? ORDER_SQUARED_OFF
          : ORDER_UPDATED_SUCCESSFULLY,
      );
      if (user) {
        getAllOrders(user?.id);
      }
    }
  }

  async function deleteOrder(orderId: string) {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) {
      console.error("Error deleting order:", error);
      toast.error(ORDER_NOT_DELETED);
    } else {
      toast.success(ORDER_DELETED_SUCCESSFULLY);
      if (user) {
        getAllOrders(user?.id);
      }
    }
  }

  async function getAllOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    console.log("data", data);

    if (error) {
      console.error("Error fetching orders:", error);
      toast.error(ORDERS_NOT_FETCHED);
    } else {
      setOrders(data);
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
