"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  X,
  Trash2,
  AlertTriangle,
  Edit2Icon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Order, OrderTabs, Symbols, SymbolsUpperCase } from "@/types";
import { useCurrentPrices, useOverallPnl } from "@/store/usePositions";
import Modal from "./ui/Modal";
import { readableCurrency, formatDateTime } from "@/utils/helpers";
import { throttle } from "@/utils/throttle";
import usePositions from "@/store/usePositions";
import useOrders from "@/store/useOrders";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface OrderTableProps {
  orderTab: OrderTabs;
  orders: Order[];
  selectedCrypto: string;
  onSquareOff: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateTrade: (
    order: Order,
    quantity: number,
    stopLoss?: number,
    target?: number,
  ) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onOrderTabChange: (tabId: OrderTabs) => void;
}

const tabs: { id: OrderTabs; label: string }[] = [
  { id: "open", label: "Positions" },
  // { id: "limit-orders", label: "Limit Orders" },
  // { id: "stop-orders", label: "Stop Orders" },
  // { id: "fills", label: "Fills" },
  { id: "all", label: "Order History" },
];

const PNL_CALCULATION_THROTTLE = 250;

interface OrderViewProps {
  loading: boolean;
  orders: Order[];
  calculateProfitLoss: (order: Order) => number;
  getProfitLossClass: (value: number) => string;
  onSquareOff: (orderId: string) => void;
  handleDeleteClick: (orderId: string) => void;
  handleEditClick: (order: Order) => void;
}

const renderCardView = ({
  loading,
  orders,
  calculateProfitLoss,
  getProfitLossClass,
  onSquareOff,
  handleDeleteClick,
  handleEditClick,
}: OrderViewProps) => (
  <div className="space-y-4">
    {loading
      ? // Loading skeleton with exact same layout
        [...Array(3)].map((_, index) => (
          <Card
            key={index}
            className="border-violet-200 bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/20"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Skeleton width={60} height={28} borderRadius={8} />
                  <Skeleton width={60} height={28} borderRadius={8} />
                </div>
                <Skeleton width={60} height={24} borderRadius={8} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <Skeleton width={60} height={12} />
                  <Skeleton width={80} height={20} />
                </div>
                <div className="space-y-1">
                  <Skeleton width={60} height={12} />
                  <Skeleton width={100} height={20} />
                </div>
                <div className="space-y-1">
                  <Skeleton width={80} height={12} />
                  <Skeleton width={90} height={20} />
                </div>
                <div className="space-y-1">
                  <Skeleton width={90} height={12} />
                  <Skeleton width={80} height={20} />
                </div>
                <div className="space-y-1">
                  <Skeleton width={60} height={12} />
                  <Skeleton width={80} height={20} />
                </div>
                <div className="space-y-1">
                  <Skeleton width={70} height={12} />
                  <Skeleton width={80} height={20} />
                </div>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Skeleton width={80} height={12} className="mb-1" />
                <Skeleton width={120} height={32} />
              </div>

              <div className="mb-4 pb-4 border-b border-violet-100 dark:border-violet-900/30">
                <Skeleton width={180} height={14} />
              </div>

              <div className="flex justify-end gap-2">
                <Skeleton width={110} height={36} borderRadius={6} />
                <Skeleton width={90} height={36} borderRadius={6} />
                <Skeleton width={90} height={36} borderRadius={6} />
              </div>
            </CardContent>
          </Card>
        ))
      : orders.map((order) => {
          const profitLoss = calculateProfitLoss(order);
          const profitLossClass = getProfitLossClass(profitLoss);

          return (
            <Card
              key={order.id}
              className="border-violet-200 bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/20 hover:shadow-lg hover:border-violet-300 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={order.type === "buy" ? "default" : "secondary"}
                      className={`text-sm px-3 py-1 ${
                        order.type === "buy"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {order.type.toUpperCase()}
                    </Badge>
                    <Badge
                      variant={
                        order.status === "open" ? "outline" : "secondary"
                      }
                      className="text-sm px-3 py-1 border-violet-300"
                    >
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                  {order?.order_details?.orderType && (
                    <Badge
                      className={`${
                        order?.order_details?.orderType === "limit"
                          ? "black"
                          : "bg-violet-600"
                      } text-white text-xs px-2 py-1`}
                    >
                      {order.order_details.orderType.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Symbol
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {order.symbol}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Amount
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {order.quantity?.toFixed(8)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Entry Price
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {readableCurrency(order.price || 0)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Closed Price
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {order.closed_price
                        ? readableCurrency(order.closed_price || 0)
                        : "N/A"}
                    </p>
                  </div>
                  {order?.order_details?.target && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                        Target
                      </p>
                      <p className="text-base font-semibold text-green-600 dark:text-green-400">
                        {readableCurrency(order.order_details.target || 0)}
                      </p>
                    </div>
                  )}
                  {order?.order_details?.stopLoss && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                        Stop Loss
                      </p>
                      <p className="text-base font-semibold text-red-600 dark:text-red-400">
                        {readableCurrency(order.order_details?.stopLoss || 0)}
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className={`mb-6 p-4 rounded-lg ${
                    profitLossClass === ""
                      ? "bg-gray-100 dark:bg-gray-800"
                      : profitLossClass.includes("green")
                        ? "bg-green-50 dark:bg-green-950/20"
                        : "bg-red-50 dark:bg-red-950/20"
                  }`}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">
                    Profit/Loss
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      profitLossClass || "text-gray-500"
                    }`}
                  >
                    {profitLoss ? readableCurrency(Math.abs(profitLoss)) : 0}
                  </p>
                </div>

                {order.created_at && (
                  <div className="mb-4 pb-4 border-b border-violet-100 dark:border-violet-900/30">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Created:{" "}
                      {formatDateTime(order.created_at, { showRelative: true })}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  {order.status === "open" && (
                    <Button
                      onClick={() => onSquareOff(order?.id || "")}
                      size="sm"
                      variant="outline"
                      className="border-violet-500 text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30 flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Square Off</span>
                    </Button>
                  )}
                  {order.status === "open" && (
                    <Button
                      onClick={() => {
                        handleEditClick(order);
                      }}
                      size="sm"
                      variant="outline"
                      className="border-blue-500 text-blue-500 hover:bg-violet-50 flex items-center gap-2"
                    >
                      <Edit2Icon className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteClick(order?.id || "")}
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
  </div>
);

const renderTableView = ({
  loading,
  orders,
  calculateProfitLoss,
  getProfitLossClass,
  onSquareOff,
  handleDeleteClick,
  handleEditClick,
}: OrderViewProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Order Type</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Symbol</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Target</TableHead>
        <TableHead>SL</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Closed Price</TableHead>
        <TableHead>Profit/Loss</TableHead>
        <TableHead>Created</TableHead>
        <TableHead>Action</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {loading
        ? // Loading skeleton with exact same table layout
          [...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton width={70} height={24} borderRadius={8} />
              </TableCell>
              <TableCell>
                <Skeleton width={60} height={24} borderRadius={8} />
              </TableCell>
              <TableCell>
                <Skeleton width={50} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton width={90} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton width={80} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton width={80} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton width={80} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton width={60} height={24} borderRadius={8} />
              </TableCell>
              <TableCell>
                <Skeleton width={70} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton width={80} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton width={90} height={16} />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Skeleton width={40} height={40} borderRadius={6} />
                  <Skeleton width={40} height={40} borderRadius={6} />
                  <Skeleton width={40} height={40} borderRadius={6} />
                </div>
              </TableCell>
            </TableRow>
          ))
        : orders.map((order: Order) => {
            const profitLoss = calculateProfitLoss(order);
            const profitLossClass = getProfitLossClass(profitLoss);
            const pnl = Math.abs(profitLoss);
            const readablePnl = readableCurrency(pnl);
            const orderId = order.id || "";

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <Badge
                    style={{
                      background:
                        order?.order_details?.orderType === "limit"
                          ? "black"
                          : "rgb(139, 92, 246)",
                    }}
                  >
                    {order?.order_details?.orderType?.toUpperCase() || "MARKET"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    style={{
                      background:
                        order.type === "buy"
                          ? "rgb(34, 197, 94)"
                          : "rgb(239, 68, 68)",
                    }}
                  >
                    {order.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{order.symbol}</TableCell>
                <TableCell>{order.quantity?.toFixed(8)}</TableCell>
                <TableCell>{readableCurrency(order.price || 0)}</TableCell>
                <TableCell>
                  {readableCurrency(order.order_details?.target || 0)}
                </TableCell>
                <TableCell>
                  {readableCurrency(order.order_details?.stopLoss || 0)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={order.status === "open" ? "outline" : "secondary"}
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.closed_price
                    ? `$${order.closed_price.toFixed(2)}`
                    : "N/A"}
                </TableCell>
                <TableCell className={profitLossClass}>{readablePnl}</TableCell>
                <TableCell>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {order.created_at
                      ? formatDateTime(order.created_at, { shortFormat: true })
                      : "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {order.status === "open" && (
                      <Button
                        onClick={() => {
                          onSquareOff(orderId);
                        }}
                        size="icon"
                        variant="outline"
                        className="border-violet-500 text-violet-500 hover:bg-violet-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    {order.status === "open" && (
                      <Button
                        onClick={() => {
                          handleEditClick(order);
                        }}
                        size="icon"
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-violet-50"
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </Button>
                    )}
                    {order.status === "closed" && (
                      <Button
                        onClick={() => handleDeleteClick(orderId)}
                        size="icon"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-violet-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
    </TableBody>
  </Table>
);

export default function OrderTable({
  orders,
  orderTab,
  onSquareOff,
  onDeleteOrder,
  onUpdateTrade,
  pagination,
  onPageChange,
  onOrderTabChange,
}: OrderTableProps) {
  const [isCardView, setIsCardView] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [stopLoss, setStopLoss] = useState("");
  const [target, setTarget] = useState("");
  const overallPnl = useOverallPnl();
  const currentPrices = useCurrentPrices();
  const { setOverallPnl } = usePositions();
  const { loading } = useOrders();

  const calculateProfitLoss = (order: Order) => {
    if (order.status === "pending") return 0;
    if (order.status === "closed" && order.profit !== undefined) {
      return order.profit;
    }

    const diff =
      currentPrices[order.symbol.toLowerCase() as Symbols] - order.price;
    const profitLoss = diff * order.quantity * (order.type === "buy" ? 1 : -1);
    return profitLoss;
  };

  const getProfitLossClass = (value: number) => {
    if (!value) return "";
    return value >= 0 ? "text-green-500" : "text-red-500";
  };

  const calculatePnL = throttle(() => {
    const currentOrders = [...orders];
    const openOrders = currentOrders.some((order) => order.status === "open");
    if (!openOrders) return;

    const openOrdersEth = currentOrders.some(
      (order) => order.symbol === "ETH" && order.status === "open",
    );
    const openOrdersSol = currentOrders.some(
      (order) => order.symbol === "SOL" && order.status === "open",
    );
    const openOrdersXauusd = currentOrders.some(
      (order) => order.symbol === "XAUUSD" && order.status === "open",
    );
    const openOrdersBtc = currentOrders.some(
      (order) => order.symbol === "BTC" && order.status === "open",
    );

    if (openOrdersEth && !currentPrices.eth) return;

    if (openOrdersSol && !currentPrices.sol) return;

    if (openOrdersXauusd && !currentPrices.xauusd) return;

    if (openOrdersBtc && !currentPrices.btc) return;

    if (openOrders) {
      const newPL = currentOrders.reduce((total, order) => {
        if (order.status === "open") {
          const price = currentPrices[order.symbol.toLowerCase() as Symbols];
          const diff = price - order.price;
          const orderPL =
            diff * order.quantity * (order.type === "buy" ? 1 : -1);
          return total + orderPL;
        }
        return total;
      }, 0);

      setOverallPnl(newPL);
    }
  }, PNL_CALCULATION_THROTTLE);

  useEffect(() => {
    calculatePnL();
  }, [
    currentPrices.btc,
    currentPrices.eth,
    currentPrices.sol,
    currentPrices.xauusd,
  ]);

  const handleDeleteClick = (orderId: string) => {
    setDeleteOrderId(orderId);
  };

  const handleConfirmDelete = () => {
    if (deleteOrderId !== null) {
      onDeleteOrder(deleteOrderId);
      setDeleteOrderId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteOrderId(null);
  };

  const handleEditClick = (order: Order) => {
    setOrder(order);
    setQuantity(order?.quantity || 0);
  };
  const handleConfirmEdit = () => {
    if (order !== null) {
      onUpdateTrade(order, quantity, parseFloat(stopLoss), parseFloat(target));
      setOrder(null);
    }
  };

  const handleCancelEdit = () => {
    setOrder(null);
  };

  const currentPrice =
    (order &&
      order.symbol &&
      currentPrices[order.symbol.toLowerCase() as Symbols]) ||
    0;

  return (
    <>
      <Card className="border-violet-500/20 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            All Orders
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="view-toggle">Table View</Label>
            <Switch
              id="view-toggle"
              checked={isCardView}
              onCheckedChange={setIsCardView}
            />
            <Label htmlFor="view-toggle">Card View</Label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onOrderTabChange(tab.id)}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  orderTab === tab.id
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
                {orderTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2 item-center text-lg font-semibold mb-4">
              Overall orders P/L:
              <p className={`${1 >= 0 ? "text-green-500" : "text-red-500"}`}>
                {readableCurrency(0)}
              </p>
            </div>

            <div className="flex gap-2 item-center text-lg font-semibold mb-4">
              Open orders P/L:
              <p
                className={`${
                  overallPnl >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {readableCurrency(Math.abs(overallPnl))}
              </p>
            </div>
          </div>

          {isCardView
            ? renderCardView({
                loading,
                orders,
                calculateProfitLoss,
                getProfitLossClass,
                onSquareOff,
                handleDeleteClick,
                handleEditClick,
              })
            : renderTableView({
                loading,
                orders,
                calculateProfitLoss,
                getProfitLossClass,
                onSquareOff,
                handleDeleteClick,
                handleEditClick,
              })}

          {orders.length === 0 && (
            <div className="flex justify-center items-center h-full my-4">
              <p className="text-gray-600 dark:text-gray-400">
                No orders found.
              </p>
            </div>
          )}

          {/* Enhanced Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
              {/* Pagination Info */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-medium text-violet-600 dark:text-violet-400">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-violet-600 dark:text-violet-400">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-violet-600 dark:text-violet-400">
                  {pagination.total}
                </span>{" "}
                orders
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <Button
                  onClick={() => onPageChange(1)}
                  disabled={pagination.page === 1}
                  variant="outline"
                  size="icon"
                  className="border-violet-300 text-violet-600 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  variant="outline"
                  className="border-violet-300 text-violet-600 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Prev</span>
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const pageNumbers = [];
                    const maxVisible = 5;
                    let startPage = Math.max(
                      1,
                      pagination.page - Math.floor(maxVisible / 2),
                    );
                    let endPage = Math.min(
                      pagination.totalPages,
                      startPage + maxVisible - 1,
                    );

                    if (endPage - startPage < maxVisible - 1) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    // First page + ellipsis
                    if (startPage > 1) {
                      pageNumbers.push(
                        <Button
                          key={1}
                          onClick={() => onPageChange(1)}
                          variant="outline"
                          size="icon"
                          className="hidden sm:inline-flex border-violet-300 text-violet-600 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/30"
                        >
                          1
                        </Button>,
                      );
                      if (startPage > 2) {
                        pageNumbers.push(
                          <span
                            key="ellipsis-1"
                            className="hidden sm:inline px-2 text-gray-400"
                          >
                            ...
                          </span>,
                        );
                      }
                    }

                    // Visible page numbers
                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(
                        <Button
                          key={i}
                          onClick={() => onPageChange(i)}
                          variant={
                            pagination.page === i ? "default" : "outline"
                          }
                          size="icon"
                          className={
                            pagination.page === i
                              ? "bg-violet-500 hover:bg-violet-600 text-white border-violet-500"
                              : "border-violet-300 text-violet-600 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/30"
                          }
                        >
                          {i}
                        </Button>,
                      );
                    }

                    // Ellipsis + last page
                    if (endPage < pagination.totalPages) {
                      if (endPage < pagination.totalPages - 1) {
                        pageNumbers.push(
                          <span
                            key="ellipsis-2"
                            className="hidden sm:inline px-2 text-gray-400"
                          >
                            ...
                          </span>,
                        );
                      }
                      pageNumbers.push(
                        <Button
                          key={pagination.totalPages}
                          onClick={() => onPageChange(pagination.totalPages)}
                          variant="outline"
                          size="icon"
                          className="hidden sm:inline-flex border-violet-300 text-violet-600 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/30"
                        >
                          {pagination.totalPages}
                        </Button>,
                      );
                    }

                    return pageNumbers;
                  })()}
                </div>

                {/* Next Page */}
                <Button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  variant="outline"
                  className="border-violet-300 text-violet-600 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>

                {/* Last Page */}
                <Button
                  onClick={() => onPageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                  variant="outline"
                  size="icon"
                  className="border-violet-300 text-violet-600 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* delete modal */}
      {deleteOrderId && (
        <Modal>
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Delete Order
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete this order? This action cannot be
            undone.
          </p>
          <div className="flex space-x-3">
            <Button
              onClick={handleConfirmDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
            <Button
              onClick={handleCancelDelete}
              variant="outline"
              className="flex-1 border-violet-300 text-violet-600 hover:bg-violet-50 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {/* edit order modal */}
      {order && (
        <Modal>
          <div className="h-full border-none">
            <CardTitle className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent mb-4">
              Edit Order
            </CardTitle>
            <CardContent className="p-2">
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Amount ({order.symbol}):</label>
                  <input
                    type="number"
                    defaultValue={order.quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    className="w-full p-2 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g., 0.1"
                    step="0.0001"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block mb-1">Stop Loss (optional):</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full p-2 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g., 45000"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block mb-1">Target (optional):</label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full p-2 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g., 55000"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <p className="mb-2">
                    Current Price: $
                    {currentPrice ? currentPrice.toFixed(2) : "Loading..."}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleConfirmEdit}
                    className="flex-1 bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="flex-1 border-violet-300 text-violet-600 hover:bg-violet-50 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Modal>
      )}
    </>
  );
}
