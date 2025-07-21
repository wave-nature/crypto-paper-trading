"use client";

import { useState, useEffect } from "react";
import TradingViewChart from "./components/TradingViewChart";
import TradingInterface from "./components/TradingInterface";
import Portfolio from "./components/Portfolio";
import OrderTable from "./components/OrderTable";
import PriceFetcher from "./components/PriceFetcher";
import TradingSummary from "./components/TradingSummary";

interface Order {
  id: number;
  type: "buy" | "sell";
  symbol: string;
  amount: number;
  price: number;
  timestamp: number;
  status: "open" | "closed";
  closedPrice?: number;
  profit?: number;
}

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
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>(() => {
    if (typeof window !== "undefined") {
      const savedPortfolio = localStorage.getItem("portfolio");
      return savedPortfolio
        ? JSON.parse(savedPortfolio)
        : Object.fromEntries(CRYPTOCURRENCIES.map((crypto) => [crypto, 0]));
    }
    return Object.fromEntries(CRYPTOCURRENCIES.map((crypto) => [crypto, 0]));
  });

  const [balance, setBalance] = useState(() => {
    if (typeof window !== "undefined") {
      const savedBalance = localStorage.getItem("balance");
      return savedBalance ? Number.parseFloat(savedBalance) : 1_000_000;
    }
    return 1_000_000;
  });

  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [orders, setOrders] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const savedOrders = localStorage.getItem("orders");
      return savedOrders ? JSON.parse(savedOrders) : [];
    }
    return [];
  });
  const [realtimePL, setRealtimePL] = useState(0);
  const [profitableTradesCount, setProfitableTradesCount] = useState(0);
  const [lossTradesCount, setLossTradesCount] = useState(0);
  const [mostProfitableTrade, setMostProfitableTrade] = useState(0);
  const [biggestLossTrade, setBiggestLossTrade] = useState(0);

  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    localStorage.setItem("balance", balance.toString());
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [portfolio, balance, orders]);

  const handleTrade = (type: "buy" | "sell", amount: number) => {
    if (currentPrice === null) return;
    // if any order is still open return
    if (orders.some((order) => order.status === "open")) {
      alert("Please square off all open orders before placing a new order");
      return;
    }
    const cost = amount * currentPrice;
    if (type === "buy") {
      if (cost > balance) {
        alert("Insufficient funds!");
        return;
      }
      setBalance((prevBalance) => prevBalance - cost);
    } else {
      setBalance((prevBalance) => prevBalance - cost);
    }

    const newOrder: Order = {
      id: Date.now(),
      type,
      symbol: selectedCrypto,
      amount,
      price: currentPrice,
      timestamp: Date.now(),
      status: "open",
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  const handlePriceUpdate = (price: number) => {
    setCurrentPrice(price);

    // Calculate real-time P/L
    const newPL = orders.reduce((total, order) => {
      if (order.status === "open" && order.symbol === selectedCrypto) {
        const diff = price - order.price;
        const orderPL = diff * order.amount * (order.type === "buy" ? 1 : -1);
        return total + orderPL;
      }
      return total + (order.profit || 0);
    }, 0);

    setRealtimePL(newPL);
  };

  const updateTradingSummary = () => {
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
  };

  useEffect(() => {
    updateTradingSummary();
  }, [
    orders,
    profitableTradesCount,
    lossTradesCount,
    mostProfitableTrade,
    biggestLossTrade,
  ]);

  const handleAddMoney = (amount: number) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  const handleSquareOff = (orderId: number) => {
    if (currentPrice === null) return;
    const prevOrders = [...orders];
    const ordersUpdate = prevOrders.map((order) => {
      if (order.id === orderId && order.status === "open") {
        const profit =
          order.type === "buy"
            ? (currentPrice - order.price) * order.amount
            : (order.price - currentPrice) * order.amount;

        return {
          ...order,
          status: "closed",
          closedPrice: currentPrice,
          profit,
        };
      }

      return order;
    });
    // calculate total balance after square off
    const latestClosedOrder = ordersUpdate.sort(
      (a, b) => b.timestamp - a.timestamp
    )[0];
    let totalBalance = 0;
    if (
      latestClosedOrder.status === "closed" &&
      latestClosedOrder.profit !== undefined
    )
      totalBalance =
        latestClosedOrder.amount * latestClosedOrder.price +
        latestClosedOrder.profit;

    setBalance((prevBal) => prevBal + totalBalance);
    setOrders(ordersUpdate);
  };

  const handleDeleteOrder = (orderId: number) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };

  const calculateOverallProfitLoss = () => {
    return orders.reduce((total, order) => {
      if (order.status === "closed" && order.profit !== undefined) {
        return total + order.profit;
      }
      return total;
    }, 0);
  };

  return (
    <div className="mx-auto px-4 py-8 my-4">
      <h1 className="text-3xl font-bold mb-6">Crypto Paper Trading</h1>
      <div className="grid grid-cols-[3fr_1fr] gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <TradingViewChart symbol={selectedCrypto} />
          <PriceFetcher
            symbol={selectedCrypto}
            onPriceUpdate={handlePriceUpdate}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <TradingInterface
            onTrade={handleTrade}
            currentPrice={currentPrice}
            selectedCrypto={selectedCrypto}
            onCryptoChange={setSelectedCrypto}
            cryptocurrencies={CRYPTOCURRENCIES}
          />
          <Portfolio balance={balance} onAddMoney={handleAddMoney} />
        </div>
      </div>
      <div className="mt-5">
        <TradingSummary
          profitableTradesCount={profitableTradesCount}
          lossTradesCount={lossTradesCount}
          totalTradesCount={orders.length}
          mostProfitableTrade={mostProfitableTrade}
          biggestLossTrade={biggestLossTrade}
        />
        <OrderTable
          orders={orders}
          currentPrice={currentPrice}
          selectedCrypto={selectedCrypto}
          onSquareOff={handleSquareOff}
          onDeleteOrder={handleDeleteOrder}
          overallProfitLoss={realtimePL}
        />
      </div>
    </div>
  );
}
