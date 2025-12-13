"use client";

import { Order, OrderNotes, OrderTabs, Symbols } from "@/types";
import {
  ORDER_DELETED_SUCCESSFULLY,
  ORDER_NOT_DELETED,
  ORDER_NOT_PLACED,
  ORDER_NOT_UPDATED,
  ORDER_SQUARED_OFF,
  ORDER_UPDATED_SUCCESSFULLY,
  ORDERS_NOT_FETCHED,
} from "@/constants/toastMessages";
import toast from "react-hot-toast";
import useOrders from "@/store/useOrders";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { useCurrentPrices } from "@/store/usePositions";
import useSummaryHook from "./useSummary";

const useOrdersHook = () => {
  const { user, setBalance } = useAuthStore();
  const { orders, setOrders, setLoading } = useOrders();
  const [orderTab, setOrderTab] = useState<OrderTabs>("open");
  const { getSummary } = useSummaryHook();
  const currentPrices = useCurrentPrices();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  // Fetch orders with pagination
  const fetchOrders = useCallback(
    async (page: number) => {
      if (!user?.id) return;
      const paginationData = await getAllOrders(user.id, page, 10, orderTab);
      if (paginationData) {
        setPagination(paginationData);
        setCurrentPage(page);
      }
    },
    [user?.id, getAllOrders, orderTab]
  );

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchOrders(1);
    }
  }, [user?.id, orderTab]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      fetchOrders(page);
    },
    [fetchOrders]
  );

  // HANDLE UPDATE TRADE
  const handleUpdateTrade = useCallback(
    (order: Order, quantity: number, stopLoss?: number, target?: number) => {
      const symbol = order.symbol;
      const balance = user?.balance || 0;
      const currentPrice = currentPrices[symbol.toLocaleLowerCase() as Symbols];

      if (currentPrice === null) return;
      const prevCurrentPriceCost = order.quantity * order.price;
      const currentCost = quantity * currentPrice;
      const previousQuantity = order.quantity;
      const avgPrice =
        (prevCurrentPriceCost + currentCost) / (previousQuantity + quantity);
      if (currentCost > balance) {
        alert("Insufficient funds!");
        return;
      }

      // setBalance(-currentCost);
      const updatedOrderDetails = {
        ...order,
        quantity: order.quantity + quantity,
        price: avgPrice,
        timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // order_details: orderDetails,
      };
      const findOrderIndex = orders.findIndex((ord) => ord.id === order.id);
      if (findOrderIndex === -1) return toast.error("Order not found!");
      const prevOrders = [...orders];
      const findOrder = prevOrders[findOrderIndex];
      findOrder.quantity = order.quantity + quantity;
      findOrder.price = avgPrice;
      findOrder.timestamp = new Date().toISOString();
      prevOrders[findOrderIndex] = findOrder;

      setOrders(prevOrders);
      toast.success(ORDER_UPDATED_SUCCESSFULLY);
      updateOrder(updatedOrderDetails, () => fetchOrders(currentPage));
    },
    [orders, setOrders, updateOrder, fetchOrders, currentPage]
  );

  // HANDLE IT IN BETTER WAY
  const handleSquareOff = useCallback(
    (orderId: string) => {
      const prevOrders = [...orders];
      const ordersUpdate: Order[] = prevOrders.map((order) => {
        if (order.id === orderId && order.status === "open") {
          const currentPrice =
            currentPrices[order.symbol.toLowerCase() as Symbols];
          const profit =
            order.type === "buy"
              ? (currentPrice - order.price) * order.quantity
              : (order.price - currentPrice) * order.quantity;

          return {
            ...order,
            status: "closed",
            closed_price: currentPrice,
            profit,
          };
        }

        return order;
      });
      // calculate total balance after square off
      const latestClosedOrder = ordersUpdate.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      let totalBalance = 0;
      if (
        latestClosedOrder.status === "closed" &&
        latestClosedOrder.profit !== undefined
      )
        totalBalance =
          latestClosedOrder.quantity * latestClosedOrder.price +
          latestClosedOrder.profit;

      setBalance(totalBalance);
      setOrders(ordersUpdate);

      // update order in database
      const order = ordersUpdate.find(
        (order) => order.id === orderId && order.status === "closed"
      );
      if (order) {
        toast.success(ORDER_SQUARED_OFF);
        updateOrder(order, () => {
          getSummary({ type: "today" });
          fetchOrders(currentPage);
        });
      }
    },
    [orders, setBalance, setOrders, updateOrder, fetchOrders, currentPage]
  );

  const handleDeleteOrder = useCallback(
    (orderId: string) => {
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      deleteOrder(orderId, () => fetchOrders(currentPage));
    },
    [orders, setOrders, deleteOrder, fetchOrders, currentPage]
  );

  const handleUpdateNotes = useCallback(
    async (orderId: string, notes: string) => {
      await updateOrder({ id: orderId, notes }, () => fetchOrders(currentPage));
    },
    [orders, setOrders, updateOrder, fetchOrders, currentPage]
  );

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

  async function updateOrder(
    order: Order | OrderNotes,
    onSuccess?: () => void
  ) {
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
    status: OrderTabs = "open"
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
    orderTab,
    pagination,
    currentPage,
    saveOrder,
    setOrderTab,
    updateOrder,
    deleteOrder,
    getAllOrders,
    fetchOrders,
    handlePageChange,
    handleSquareOff,
    handleDeleteOrder,
    handleUpdateNotes,
    handleUpdateTrade,
  };
};

export default useOrdersHook;
