"use client";

import { useState, useEffect, useCallback } from "react";
import TradingViewChart from "./TradingViewChart";
import TradingInterface from "./TradingInterface";
import Portfolio from "./Portfolio";
import OrderTable from "./OrderTable";
import PriceFetcher from "./PriceFetcher";
import TradingSummary from "./TradingSummary";
import Navbar from "./Navbar";
import { Order } from "@/types";
import TradingInterfaceHorizontal from "./TradingInterfaceHorizontal";
import useAuthStore from "@/store/useAuthStore";
import useOrders from "@/store/useOrders";
import toast from "react-hot-toast";
import useOrdersHook from "@/hooks/useOrders";
import usePriceFetcher from "@/hooks/usePriceFetcher";
import { useCurrentPrice, useOverallPnl } from "@/store/usePositions";

const CRYPTOCURRENCIES = [
  "BTC",
  "ETH",
  "SOL",
  "ADA",
  "DOT",
  "LINK",
  "AVAX",
  "MATIC",
  "XAUUSD",
];

export default function Home() {
  const { user, setBalance } = useAuthStore();
  const { orders, setOrders } = useOrders();
  const { saveOrder, updateOrder, deleteOrder, getAllOrders } = useOrdersHook();

  // Use selective subscriptions to prevent unnecessary re-renders
  const currentPrice = useCurrentPrice();

  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [fullChart, setFullChart] = useState(false);
  const [profitableTradesCount, setProfitableTradesCount] = useState(0);
  const [lossTradesCount, setLossTradesCount] = useState(0);
  const [mostProfitableTrade, setMostProfitableTrade] = useState(0);
  const [biggestLossTrade, setBiggestLossTrade] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Price fetcher runs in the background
  usePriceFetcher({ symbol: selectedCrypto, orders });

  const balance = user?.balance || 0;

  // Fetch orders with pagination
  const fetchOrders = useCallback(
    async (page: number) => {
      if (!user?.id) return;
      const paginationData = await getAllOrders(user.id, page, 10);
      if (paginationData) {
        setPagination(paginationData);
        setCurrentPage(page);
      }
    },
    [user?.id, getAllOrders],
  );

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchOrders(1);
    }
  }, [user?.id]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      fetchOrders(page);
    },
    [fetchOrders],
  );

  const handleTrade = useCallback(
    (
      type: "buy" | "sell",
      quantity: number,
      orderDetails: {
        orderType: "market" | "limit";
        limitPrice?: number;
        stopLoss?: number;
        target?: number;
      },
    ) => {
      if (currentPrice === null) return;
      // if any order is still open return
      if (
        orders.some(
          (order) => order.status === "open" || order.status === "pending",
        )
      ) {
        alert("Please square off all open orders before placing a new order");
        return;
      }
      if (orderDetails.orderType === "limit") {
        const cost = quantity * orderDetails?.limitPrice!;
        if (cost > balance) {
          alert("Insufficient funds!");
          return;
        }

        setBalance(-cost);

        const newOrder: Order = {
          type,
          symbol: selectedCrypto,
          quantity,
          price: orderDetails.limitPrice!,
          timestamp: new Date().toISOString(),
          status: "pending",
          order_details: orderDetails,
          user_id: user?.id,
        };

        const newOrders = [newOrder, ...orders];
        setOrders(newOrders);
        saveOrder(newOrder, () => fetchOrders(currentPage));
      } else {
        const cost = quantity * currentPrice;

        if (cost > balance) {
          alert("Insufficient funds!");
          return;
        }

        setBalance(-cost);

        const newOrder: Order = {
          type,
          symbol: selectedCrypto,
          quantity,
          price: currentPrice,
          timestamp: new Date().toISOString(),
          status: "open",
          order_details: orderDetails,
          user_id: user?.id,
        };
        const newOrders = [newOrder, ...orders];
        setOrders(newOrders);
        saveOrder(newOrder, () => fetchOrders(currentPage));
      }
    },
    [
      currentPrice,
      orders,
      balance,
      selectedCrypto,
      user?.id,
      setBalance,
      setOrders,
      saveOrder,
      fetchOrders,
      currentPage,
    ],
  );

  const handleUpdateTrade = useCallback(
    (order: Order, quantity: number, stopLoss?: number, target?: number) => {
      if (currentPrice === null) return;
      const prevCurrentPriceCost = order.quantity * order.price;
      const currentCost = quantity * currentPrice;
      const previousQuantity = order.quantity;
      const avgPrice =
        (prevCurrentPriceCost + currentCost) / (previousQuantity + quantity);

      console.log("avg", {
        prevCurrentPriceCost,
        currentCost,
        previousQuantity,
        avgPrice,
        quantity,
      });

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
      updateOrder(updatedOrderDetails, () => fetchOrders(currentPage));
    },
    [
      currentPrice,
      orders,
      balance,
      setOrders,
      updateOrder,
      fetchOrders,
      currentPage,
    ],
  );

  const updateTradingSummary = useCallback(() => {
    let profitable = 0;
    let loss = 0;
    let maxProfit = 0;
    let maxLoss = 0;

    orders.forEach((order) => {
      if (order.status === "closed" && order.profit !== undefined) {
        if (order.profit > 0) {
          profitable++;
          maxProfit = Math.max(maxProfit, order.profit);
        } else if (order.profit < 0) {
          loss++;
          maxLoss = Math.min(maxLoss, order.profit);
        }
      }
    });

    setProfitableTradesCount(profitable);
    setLossTradesCount(loss);
    setMostProfitableTrade(maxProfit);
    setBiggestLossTrade(Math.abs(maxLoss));
  }, [orders]);

  // handle limit order execution
  useEffect(() => {
    if (!currentPrice) return;

    const copyOrders = [...orders];
    const limitOrderIndex = copyOrders.findIndex(
      (order) =>
        order.status === "pending" &&
        order?.order_details?.orderType === "limit",
    );
    let limitOrder;
    if (limitOrderIndex !== -1) {
      limitOrder = copyOrders[limitOrderIndex];
    }
    if (limitOrder) {
      const cost = limitOrder.quantity * limitOrder?.price!;
      const limitOrderPrice = Math.floor(limitOrder?.price);
      const flooredCurrentPrice = Math.floor(currentPrice);

      if (
        limitOrder.type === "buy" &&
        (flooredCurrentPrice === limitOrderPrice ||
          flooredCurrentPrice - 1 === limitOrderPrice - 1 ||
          flooredCurrentPrice + 1 === limitOrderPrice + 1)
      ) {
        if (cost > balance) {
          alert("Insufficient funds!");
          return;
        }
        setBalance(-cost);
        // update order
        limitOrder.status = "open";
        copyOrders[limitOrderIndex] = limitOrder;
        setOrders(copyOrders);
      } else {
        if (
          flooredCurrentPrice === limitOrderPrice ||
          flooredCurrentPrice - 0.5 === limitOrderPrice - 0.5 ||
          flooredCurrentPrice + 0.5 === limitOrderPrice + 0.5
        ) {
          setBalance(-cost);
          // update order
          limitOrder.status = "open";
          copyOrders[limitOrderIndex] = limitOrder;
          setOrders(copyOrders);
        }
      }
    }
  }, [currentPrice, orders, balance, setBalance, setOrders]);

  useEffect(() => {
    updateTradingSummary();
  }, [orders, updateTradingSummary]);

  const handleSquareOff = useCallback(
    (orderId: string) => {
      if (currentPrice === null) return;
      const prevOrders = [...orders];
      const ordersUpdate: Order[] = prevOrders.map((order) => {
        if (order.id === orderId && order.status === "open") {
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
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
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
        (order) => order.id === orderId && order.status === "closed",
      );
      if (order) updateOrder(order, () => fetchOrders(currentPage));
    },
    [
      currentPrice,
      orders,
      setBalance,
      setOrders,
      updateOrder,
      fetchOrders,
      currentPage,
    ],
  );

  useEffect(() => {
    if (!currentPrice) return;

    const copyOrders = [...orders];
    const openOrderIndex = copyOrders.findIndex(
      (order) => order.status === "open",
    );
    let order;
    if (openOrderIndex !== -1) {
      order = copyOrders[openOrderIndex];
    }

    // handle sl
    if (order && order?.order_details?.stopLoss && order?.id) {
      const sl = Math.floor(order?.order_details?.stopLoss);
      const flooredCurrentPrice = Math.floor(currentPrice);

      if (
        sl === flooredCurrentPrice ||
        sl - 0.5 === flooredCurrentPrice - 0.5 ||
        sl + 0.5 === flooredCurrentPrice + 0.5
      ) {
        handleSquareOff(order.id);
      }
    }

    // handle target
    if (order && order?.order_details?.target && order?.id) {
      const target = Math.floor(order?.order_details?.target);
      const flooredCurrentPrice = Math.floor(currentPrice);

      if (
        target === flooredCurrentPrice ||
        target - 0.5 === flooredCurrentPrice - 0.5 ||
        target + 0.5 === flooredCurrentPrice + 0.5
      ) {
        handleSquareOff(order.id);
      }
    }
  }, [currentPrice, orders, handleSquareOff]);

  const handleDeleteOrder = useCallback(
    (orderId: string) => {
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      deleteOrder(orderId, () => fetchOrders(currentPage));
    },
    [orders, setOrders, deleteOrder, fetchOrders, currentPage],
  );

  return (
    <>
      <div className="mx-auto px-4 py-4">
        <div
          className={`flex items-center ${
            fullChart ? "justify-between" : "justify-end"
          } mb-2`}
        >
          {fullChart ? (
            <div className="w-[95%]">
              <TradingInterfaceHorizontal
                onTrade={handleTrade}
                currentPrice={currentPrice}
                selectedCrypto={selectedCrypto}
                onCryptoChange={setSelectedCrypto}
                cryptocurrencies={CRYPTOCURRENCIES}
                onSquareOff={handleSquareOff}
                orders={orders}
              />
            </div>
          ) : null}
          <button
            className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-1 rounded transition-colors font-normal"
            onClick={() => setFullChart(!fullChart)}
          >
            {fullChart ? "Exit" : "Full Chart"}
          </button>
        </div>

        <div className={`grid ${fullChart ? "" : "grid-cols-[3fr_1fr]"} gap-6`}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[90vh]">
            <TradingViewChart symbol={selectedCrypto} />
          </div>
          {fullChart ? null : (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <TradingInterface
                onTrade={handleTrade}
                currentPrice={currentPrice}
                selectedCrypto={selectedCrypto}
                onCryptoChange={setSelectedCrypto}
                cryptocurrencies={CRYPTOCURRENCIES}
                onSquareOff={handleSquareOff}
                orders={orders}
              />
            </div>
          )}
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <TradingSummary
              profitableTradesCount={profitableTradesCount}
              lossTradesCount={lossTradesCount}
              totalTradesCount={orders.length}
              mostProfitableTrade={mostProfitableTrade}
              biggestLossTrade={biggestLossTrade}
            />
            <Portfolio balance={balance} />
          </div>
          <OrderTable
            orders={orders}
            currentPrice={currentPrice}
            selectedCrypto={selectedCrypto}
            onSquareOff={handleSquareOff}
            onDeleteOrder={handleDeleteOrder}
            onUpdateTrade={handleUpdateTrade}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
