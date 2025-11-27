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
import { X, Trash2, AlertTriangle, Edit2Icon } from "lucide-react";
import { Order } from "@/types";
import useStore, { useOverallPnl } from "@/store/usePositions";
import Modal from "./ui/Modal";
import { readableCurrency } from "@/utils/helpers";

interface OrderTableProps {
  orders: Order[];
  currentPrice: number | null;
  selectedCrypto: string;
  onSquareOff: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateTrade: (
    order: Order,
    quantity: number,
    stopLoss?: number,
    target?: number,
  ) => void;
}

const tabs = [
  { id: "positions", label: "Positions" },
  { id: "open-orders", label: "Open Orders" },
  { id: "stop-orders", label: "Stop Orders" },
  { id: "fills", label: "Fills" },
  { id: "order-history", label: "Order History" },
];

interface OrderViewProps {
  paginatedOrders: Order[];
  calculateProfitLoss: (order: Order) => string;
  getProfitLossClass: (value: string) => string;
  onSquareOff: (orderId: string) => void;
  handleDeleteClick: (orderId: string) => void;
  handleEditClick: (order: Order) => void;
}

const renderCardView = ({
  paginatedOrders,
  calculateProfitLoss,
  getProfitLossClass,
  onSquareOff,
  handleDeleteClick,
  handleEditClick,
}: OrderViewProps) => (
  <div className="space-y-4">
    {paginatedOrders.map((order) => {
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
                  variant={order.status === "open" ? "outline" : "secondary"}
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
                profitLoss === "N/A"
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
                {profitLoss === "N/A"
                  ? profitLoss
                  : `${
                      profitLoss.startsWith("-")
                        ? "-"
                        : "+" +
                          readableCurrency(Math.abs(parseFloat(profitLoss)))
                    }`}
              </p>
            </div>

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
  paginatedOrders,
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
        <TableHead>Action</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {paginatedOrders.map((order: Order) => {
        const profitLoss = calculateProfitLoss(order);
        const profitLossClass = getProfitLossClass(profitLoss);
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
              {order.closed_price ? `$${order.closed_price.toFixed(2)}` : "N/A"}
            </TableCell>
            <TableCell className={profitLossClass}>
              {profitLoss === "N/A"
                ? profitLoss
                : `${
                    profitLoss.startsWith("-")
                      ? "-"
                      : "+" + readableCurrency(parseFloat(profitLoss))
                  }`}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {order.status === "open" && (
                  <Button
                    onClick={() => {
                      console.log("squaring off order", orderId);
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
  currentPrice,
  selectedCrypto,
  onSquareOff,
  onDeleteOrder,
  onUpdateTrade,
}: OrderTableProps) {
  const [isCardView, setIsCardView] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("positions");
  const [quantity, setQuantity] = useState(0);
  const [stopLoss, setStopLoss] = useState("");
  const [target, setTarget] = useState("");
  const { setPnL } = useStore();
  const overallPnl = useOverallPnl();

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const calculateProfitLoss = (order: Order) => {
    if (order.status === "pending") return "N/A";
    if (order.status === "closed" && order.profit !== undefined) {
      return order.profit.toFixed(2);
    }
    if (!currentPrice || order.symbol !== selectedCrypto) return "N/A";
    const diff = currentPrice - order.price;
    const profitLoss = diff * order.quantity * (order.type === "buy" ? 1 : -1);
    return profitLoss.toFixed(2);
  };

  const getProfitLossClass = (value: string) => {
    if (value === "N/A") return "";
    const numValue = Number.parseFloat(value);
    return numValue >= 0 ? "text-green-500" : "text-red-500";
  };

  useEffect(() => {
    const order = orders.find((order) => order.status === "open");
    if (!order) return;

    const pnl = calculateProfitLoss(order);
    setPnL(parseFloat(pnl));
  }, [currentPrice]);

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
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div
            className={`text-xl font-semibold mb-4 ${
              overallPnl >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            Overall P/L: {overallPnl >= 0 ? "+" : "-"}
            {readableCurrency(overallPnl)}
          </div>

          {isCardView
            ? renderCardView({
                paginatedOrders,
                calculateProfitLoss,
                getProfitLossClass,
                onSquareOff,
                handleDeleteClick,
                handleEditClick,
              })
            : renderTableView({
                paginatedOrders,
                calculateProfitLoss,
                getProfitLossClass,
                onSquareOff,
                handleDeleteClick,
                handleEditClick,
              })}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="border-violet-500 text-violet-500 hover:bg-violet-50"
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={
                    currentPage === i + 1
                      ? "bg-violet-500 hover:bg-violet-600"
                      : "border-violet-500 text-violet-500 hover:bg-violet-50"
                  }
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                className="border-violet-500 text-violet-500 hover:bg-violet-50"
              >
                Next
              </Button>
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
                  <label className="block mb-1">
                    Amount ({selectedCrypto}):
                  </label>
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
