"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import TradingViewChart from "./TradingViewChart";
import TradingInterface from "./TradingInterface";
import Portfolio from "./Portfolio";
import OrderTable from "./OrderTable";
import TradingSummary from "./TradingSummary";
import { Order, Symbols, SymbolsUpperCase } from "@/types";
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
import { ORDER_PLACED_SUCCESSFULLY } from "@/constants/toastMessages";
import { CRYPTOCURRENCIES, ORIGINAL_SORTED_ARR } from "@/constants";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, LayoutDashboard } from "lucide-react";

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
  const { saveOrder } = useOrdersHook();
  const { updateSettings, getSettings } = useSettingsHook();
  const {
    pagination,
    orderTab,
    setOrderTab,
    fetchOrders,
    handleDeleteOrder,
    handleSquareOff,
    handleUpdateNotes,
    handlePageChange,
    handleUpdateTrade,
  } = useOrdersHook();
  const { settings } = useSettings();
  const [activeTabs, setActiveTabs] =
    useState<SymbolsUpperCase[]>(CRYPTOCURRENCIES);
  const [sortedArr, setSortedArr] = useState<number[]>(ORIGINAL_SORTED_ARR);

  const currentPrices = useCurrentPrices();

  // Use selective subscriptions to prevent unnecessary re-renders
  const [selectedCrypto, setSelectedCrypto] = useState<SymbolsUpperCase | "">(
    ""
  );
  const [fullChart, setFullChart] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Price fetcher runs in the background
  usePriceFetcher({ symbol: selectedCrypto, orders });

  const balance = user?.balance || 0;

  // rearrange charts
  useEffect(() => {
    if (selectedCrypto) {
      const activeIndex = CRYPTOCURRENCIES.indexOf(selectedCrypto);
      const maxValue = [...sortedArr].sort((a, b) => b - a)[0];
      const maxIndex = sortedArr.indexOf(maxValue);
      const updatedArr = [...sortedArr];
      // swap values
      const tempValue = updatedArr[activeIndex];
      updatedArr[activeIndex] = updatedArr[maxIndex];
      updatedArr[maxIndex] = tempValue;
      setSortedArr(updatedArr);
    }
  }, [selectedCrypto]);

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
      const chartRef = document.getElementById(
        `tradingview_widget_${selectedCrypto}`
      );
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
      <div className="mx-auto px-4 pt-2 pb-4">
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
            className="bg-violet-500 hover:bg-violet-600 text-white text-sm px-4 py-[3px] rounded transition-colors font-normal whitespace-nowrap"
            onClick={() => setFullChart(!fullChart)}
          >
            {fullChart ? "Exit" : "Full Chart"}
          </button>
        </div>

        <div
          className={`grid ${
            fullChart ? "grid-cols-[auto_1fr]" : "grid-cols-[5.2fr_1fr]"
          } gap-2 transition-all`}
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

          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[90vh] relative">
            {CRYPTOCURRENCIES.map((crypto, index) => (
              <TradingViewChart
                key={index}
                symbol={crypto}
                z={sortedArr[index]}
              />
            ))}
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
          {/* Summary Toggle Section */}
          <div className="mt-6 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSummaryOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <LayoutDashboard className="h-4 w-4" />
              <span>
                {isSummaryOpen
                  ? "Hide Dashboard Summary"
                  : "Show Dashboard Summary"}
              </span>
            </Button>
          </div>

          {isSummaryOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <TradingSummary />
              <Portfolio balance={balance} />
            </div>
          )}
          <OrderTable
            orders={orders}
            pagination={pagination}
            orderTab={orderTab}
            onSquareOff={handleSquareOff}
            onDeleteOrder={handleDeleteOrder}
            onUpdateTrade={handleUpdateTrade}
            onUpdateNotes={handleUpdateNotes}
            onPageChange={handlePageChange}
            onOrderTabChange={setOrderTab}
          />
        </div>
      </div>
    </>
  );
}
