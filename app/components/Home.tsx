"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import TradingViewChart from "./TradingViewChart";
import TradingInterface from "./TradingInterface";
import Portfolio from "./Portfolio";
import OrderTable from "./OrderTable";
import TradingSummary from "./TradingSummary";
import { Order, OrderTabs, Symbols, SymbolsUpperCase } from "@/types";
import TradingInterfaceHorizontal from "./TradingInterfaceHorizontal";
import useAuthStore from "@/store/useAuthStore";
import useOrders from "@/store/useOrders";
import toast from "react-hot-toast";
import useOrdersHook from "@/hooks/useOrders";
import usePriceFetcher from "@/hooks/usePriceFetcher";
import { useCurrentPrices } from "@/store/usePositions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import useSettingsHook from "@/hooks/useSettings";
import useSettings from "@/store/useSettings";
import CryptoTabs from "./CryptoTabs";
import {
  ORDER_PLACED_SUCCESSFULLY,
  ORDER_SQUARED_OFF,
  ORDER_UPDATED_SUCCESSFULLY,
} from "@/constants/toastMessages";
import useSummaryHook from "@/hooks/useSummary";
import { CRYPTOCURRENCIES } from "@/constants";
// extra pixels to extend screenshot area
const EXTRA_BOTTOM = 50;

// ImageCapture API TypeScript declarations
declare global {
  class ImageCapture {
    constructor(track: MediaStreamTrack);
    grabFrame(): Promise<ImageBitmap>;
    takePhoto(): Promise<Blob>;
  }
}

export default function Home() {
  const { user, setBalance } = useAuthStore();
  const { orders, setOrders } = useOrders();
  const { saveOrder, updateOrder, deleteOrder, getAllOrders } = useOrdersHook();
  const { updateSettings, getSettings } = useSettingsHook();
  const { getSummary } = useSummaryHook();
  const { settings } = useSettings();
  const [orderTab, setOrderTab] = useState<OrderTabs>("open");
  const [activeTabs, setActiveTabs] =
    useState<SymbolsUpperCase[]>(CRYPTOCURRENCIES);

  const currentPrices = useCurrentPrices();

  // Use selective subscriptions to prevent unnecessary re-renders
  const [selectedCrypto, setSelectedCrypto] = useState<SymbolsUpperCase | "">(
    ""
  );
  const [fullChart, setFullChart] = useState(false);

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

  useEffect(() => {
    const crypto = localStorage.getItem("selectedCrypto");
    const openOrder = orders.find((order) => order.status === "open");

    // Ensure the saved crypto is in active tabs
    if (crypto && CRYPTOCURRENCIES.includes(crypto as SymbolsUpperCase)) {
      if (!activeTabs.includes(crypto as SymbolsUpperCase)) {
        setActiveTabs((prev) => [...prev, crypto as SymbolsUpperCase]);
      }
      setSelectedCrypto(crypto as SymbolsUpperCase);
    } else if (openOrder) {
      if (!activeTabs.includes(openOrder.symbol as SymbolsUpperCase)) {
        setActiveTabs((prev) => [
          ...prev,
          openOrder.symbol as SymbolsUpperCase,
        ]);
      }
      setSelectedCrypto(openOrder.symbol);
    } else {
      setSelectedCrypto("BTC");
    }
  }, [orders, activeTabs]); // Added activeTabs to dep array logic if needed but keeping minimal to avoid loops

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

  // Screenshot capture function
  const captureScreenshot = useCallback(async (): Promise<string | null> => {
    try {
      toast.success("Select 'Entire Screen' for full screenshot", {
        duration: 3000,
        position: "top-center",
      });

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen",
          frameRate: { ideal: 60 },
        } as any,
      });

      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);

      // wait for stream to ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      const bitmap = await imageCapture.grabFrame();

      // stop stream
      stream.getTracks().forEach((t) => t.stop());

      // Convert to full canvas
      const fullCanvas = document.createElement("canvas");
      fullCanvas.width = bitmap.width;
      fullCanvas.height = bitmap.height;
      const fullCtx = fullCanvas.getContext("2d")!;
      fullCtx.drawImage(bitmap, 0, 0);
      const chartRef = document.getElementById("tradingview_widget");
      // Now crop the TradingView chart region
      if (!chartRef) {
        console.error("Chart ref missing");
        return null;
      }

      const rect = chartRef.getBoundingClientRect();

      // Calculate scaling ratio (because bitmap != screen logical size)
      // Calculate scaling ratio (because bitmap != screen logical size)
      const scaleX = bitmap.width / window.innerWidth;
      const scaleY = bitmap.height / window.innerHeight;

      const cropX = rect.left * scaleX;
      const cropY = rect.top * scaleY;
      const cropW = rect.width * scaleX;
      const cropH = (rect.height + EXTRA_BOTTOM) * scaleY;

      // Create cropped canvas
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropW;
      cropCanvas.height = cropH;
      const cropCtx = cropCanvas.getContext("2d")!;

      cropCtx.drawImage(
        fullCanvas,
        cropX,
        cropY,
        cropW,
        cropH,
        0,
        0,
        cropW,
        cropH
      );

      const dataUrl = cropCanvas.toDataURL("image/png", 0.95);

      // Convert base64 to Blob
      const base64Data = dataUrl.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // Upload to Supabase Storage
      const supabase = createSupabaseBrowserClient();
      const fileName = `screenshot_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}.png`;
      const filePath = `trades/${user?.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("screenshots")
        .upload(filePath, blob, {
          contentType: "image/png",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload screenshot");
        return null;
      }
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("screenshots")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Crop capture failed:", error);
      return null;
    }
  }, [user?.id]);

  const handleScreenshotToggle = useCallback(
    (checked: boolean) => {
      if (user?.id)
        updateSettings({ userId: user.id, enableScreenshot: checked }, () =>
          getSettings(user.id)
        );
    },
    [user?.id]
  );

  const handleTrade = useCallback(
    async (
      type: "buy" | "sell",
      quantity: number,
      symbol: SymbolsUpperCase | "",
      orderDetails: {
        orderType: "market" | "limit";
        limitPrice?: number;
        stopLoss?: number;
        target?: number;
      }
    ) => {
      const currentPrice = currentPrices[symbol.toLocaleLowerCase() as Symbols];
      if (currentPrice === null) return;

      // Capture screenshot before placing order
      const screenshotUrl = settings.enableScreenshot
        ? await captureScreenshot()
        : null;

      if (orderDetails.orderType === "limit") {
        const cost = quantity * orderDetails?.limitPrice!;
        if (cost > balance) {
          alert("Insufficient funds!");
          return;
        }

        setBalance(-cost);

        const newOrder: Order = {
          type,
          symbol,
          quantity,
          price: orderDetails.limitPrice!,
          timestamp: new Date().toISOString(),
          status: "pending",
          order_details: orderDetails,
          user_id: user?.id,
          screenshot_url: screenshotUrl,
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
          symbol,
          quantity,
          price: currentPrice,
          timestamp: new Date().toISOString(),
          status: "open",
          order_details: orderDetails,
          user_id: user?.id,
          screenshot_url: screenshotUrl || undefined,
        };
        const newOrders = [newOrder, ...orders];
        setOrders(newOrders);
        saveOrder(newOrder, () => fetchOrders(currentPage));
      }
      toast.success(ORDER_PLACED_SUCCESSFULLY);
    },
    [
      orders,
      balance,
      selectedCrypto,
      user?.id,
      setBalance,
      setOrders,
      saveOrder,
      fetchOrders,
      currentPage,
    ]
  );

  const handleUpdateTrade = useCallback(
    (order: Order, quantity: number, stopLoss?: number, target?: number) => {
      const symbol = order.symbol;
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
    [orders, balance, setOrders, updateOrder, fetchOrders, currentPage]
  );

  // handle limit order execution
  // useEffect(() => {
  //   if (!currentPrice) return;

  //   const copyOrders = [...orders];
  //   const limitOrderIndex = copyOrders.findIndex(
  //     (order) =>
  //       order.status === "pending" &&
  //       order?.order_details?.orderType === "limit",
  //   );
  //   let limitOrder;
  //   if (limitOrderIndex !== -1) {
  //     limitOrder = copyOrders[limitOrderIndex];
  //   }
  //   if (limitOrder) {
  //     const cost = limitOrder.quantity * limitOrder?.price!;
  //     const limitOrderPrice = Math.floor(limitOrder?.price);
  //     const flooredCurrentPrice = Math.floor(currentPrice);

  //     if (
  //       limitOrder.type === "buy" &&
  //       (flooredCurrentPrice === limitOrderPrice ||
  //         flooredCurrentPrice - 1 === limitOrderPrice - 1 ||
  //         flooredCurrentPrice + 1 === limitOrderPrice + 1)
  //     ) {
  //       if (cost > balance) {
  //         alert("Insufficient funds!");
  //         return;
  //       }
  //       setBalance(-cost);
  //       // update order
  //       limitOrder.status = "open";
  //       copyOrders[limitOrderIndex] = limitOrder;
  //       setOrders(copyOrders);
  //     } else {
  //       if (
  //         flooredCurrentPrice === limitOrderPrice ||
  //         flooredCurrentPrice - 0.5 === limitOrderPrice - 0.5 ||
  //         flooredCurrentPrice + 0.5 === limitOrderPrice + 0.5
  //       ) {
  //         setBalance(-cost);
  //         // update order
  //         limitOrder.status = "open";
  //         copyOrders[limitOrderIndex] = limitOrder;
  //         setOrders(copyOrders);
  //       }
  //     }
  //   }
  // }, [currentPrice, orders, balance, setBalance, setOrders]);

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

  // HANDLE SL
  // useEffect(() => {
  //   if (!currentPrice) return;

  //   const copyOrders = [...orders];
  //   const openOrderIndex = copyOrders.findIndex(
  //     (order) => order.status === "open",
  //   );
  //   let order;
  //   if (openOrderIndex !== -1) {
  //     order = copyOrders[openOrderIndex];
  //   }

  //   // handle sl
  //   if (order && order?.order_details?.stopLoss && order?.id) {
  //     const sl = Math.floor(order?.order_details?.stopLoss);
  //     const flooredCurrentPrice = Math.floor(currentPrice);

  //     if (
  //       sl === flooredCurrentPrice ||
  //       sl - 0.5 === flooredCurrentPrice - 0.5 ||
  //       sl + 0.5 === flooredCurrentPrice + 0.5
  //     ) {
  //       handleSquareOff(order.id);
  //     }
  //   }

  //   // handle target
  //   if (order && order?.order_details?.target && order?.id) {
  //     const target = Math.floor(order?.order_details?.target);
  //     const flooredCurrentPrice = Math.floor(currentPrice);

  //     if (
  //       target === flooredCurrentPrice ||
  //       target - 0.5 === flooredCurrentPrice - 0.5 ||
  //       target + 0.5 === flooredCurrentPrice + 0.5
  //     ) {
  //       handleSquareOff(order.id);
  //     }
  //   }
  // }, [orders, handleSquareOff]);

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

  const handleTabSelect = useCallback((tab: SymbolsUpperCase) => {
    setSelectedCrypto(tab);
    localStorage.setItem("selectedCrypto", tab);
  }, []);

  const handleTabAdd = useCallback(
    (tab: SymbolsUpperCase) => {
      if (!activeTabs.includes(tab)) {
        setActiveTabs((prev) => [...prev, tab]);
      }
      handleTabSelect(tab);
    },
    [activeTabs, handleTabSelect]
  );

  const handleTabClose = useCallback(
    (tab: SymbolsUpperCase) => {
      const newTabs = activeTabs.filter((t) => t !== tab);
      setActiveTabs(newTabs);

      if (selectedCrypto === tab) {
        if (newTabs.length > 0) {
          handleTabSelect(newTabs[newTabs.length - 1]);
        } else {
          setSelectedCrypto("");
        }
      }
    },
    [activeTabs, selectedCrypto, handleTabSelect]
  );

  return (
    <>
      <div className="mx-auto px-4 py-4">
        <div
          className={`flex items-center ${
            fullChart ? "justify-between" : "justify-between"
          } mb-2`}
        >
          {/* Horizontal Tabs for Standard View */}
          {!fullChart && (
            <CryptoTabs
              activeTabs={activeTabs}
              selectedTab={selectedCrypto}
              onSelect={handleTabSelect}
              onClose={handleTabClose}
              onAdd={handleTabAdd}
            />
          )}

          {fullChart ? (
            <div className="w-[95%]">
              <TradingInterfaceHorizontal
                onTrade={handleTrade}
                selectedCrypto={selectedCrypto}
                onSquareOff={handleSquareOff}
                onScreenshotToggle={handleScreenshotToggle}
                orders={orders}
              />
            </div>
          ) : null}
          <button
            className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-1 rounded transition-colors font-normal whitespace-nowrap"
            onClick={() => setFullChart(!fullChart)}
          >
            {fullChart ? "Exit" : "Full Chart"}
          </button>
        </div>

        <div
          className={`grid ${
            fullChart ? "grid-cols-[auto_1fr]" : "grid-cols-[5fr_1fr]"
          } gap-6 transition-all`}
        >
          {/* Vertical Tabs for Full Chart View */}
          {fullChart && (
            <div className="pt-2">
              <CryptoTabs
                activeTabs={activeTabs}
                selectedTab={selectedCrypto}
                onSelect={handleTabSelect}
                onClose={handleTabClose}
                onAdd={handleTabAdd}
                orientation="vertical"
              />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[90vh]">
            <TradingViewChart symbol={selectedCrypto} />
          </div>
          {fullChart ? null : (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <TradingInterface
                onTrade={handleTrade}
                selectedCrypto={selectedCrypto}
                onSquareOff={handleSquareOff}
                onScreenshotToggle={handleScreenshotToggle}
                orders={orders}
              />
            </div>
          )}
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <TradingSummary />
            <Portfolio balance={balance} />
          </div>
          <OrderTable
            orders={orders}
            selectedCrypto={selectedCrypto}
            onSquareOff={handleSquareOff}
            onDeleteOrder={handleDeleteOrder}
            onUpdateTrade={handleUpdateTrade}
            onUpdateNotes={handleUpdateNotes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onOrderTabChange={setOrderTab}
            orderTab={orderTab}
          />
        </div>
      </div>
    </>
  );
}
