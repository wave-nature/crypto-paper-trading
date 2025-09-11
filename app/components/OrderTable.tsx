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
import { X, Trash2 } from "lucide-react";
import { Order } from "@/types";
import useStore from "@/store";

interface OrderTableProps {
  orders: Order[];
  currentPrice: number | null;
  selectedCrypto: string;
  onSquareOff: (orderId: number) => void;
  onDeleteOrder: (orderId: number) => void;
  overallProfitLoss: number;
}

export default function OrderTable({
  orders,
  currentPrice,
  selectedCrypto,
  onSquareOff,
  onDeleteOrder,
  overallProfitLoss,
}: OrderTableProps) {
  const [isCardView, setIsCardView] = useState(false);
  const { setPnL } = useStore();

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const calculateProfitLoss = (order: Order) => {
    if (order.status === "pending") return "N/A";
    if (order.status === "closed" && order.profit !== undefined) {
      return order.profit.toFixed(2);
    }
    if (!currentPrice || order.symbol !== selectedCrypto) return "N/A";
    const diff = currentPrice - order.price;
    const profitLoss = diff * order.amount * (order.type === "buy" ? 1 : -1);
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

  const renderCardView = () => (
    <div className="space-y-4">
      {paginatedOrders.map((order) => {
        const profitLoss = calculateProfitLoss(order);
        const profitLossClass = getProfitLossClass(profitLoss);

        return (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-center mb-2">
              <Badge variant={order.type === "buy" ? "default" : "secondary"}>
                {order.type.toUpperCase()}
              </Badge>
              <Badge
                variant={order.status === "open" ? "outline" : "secondary"}
              >
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Symbol: {order.symbol}</div>
              <div>Amount: {order.amount.toFixed(8)}</div>
              <div>Price: ${order.price.toFixed(2)}</div>
              <div>
                Closed Price:{" "}
                {order.closedPrice ? `$${order.closedPrice.toFixed(2)}` : "N/A"}
              </div>
              <div className={`col-span-2 ${profitLossClass}`}>
                Profit/Loss:{" "}
                {profitLoss === "N/A"
                  ? profitLoss
                  : `${profitLoss.startsWith("-") ? "" : "+"}$${profitLoss}`}
              </div>
            </div>
            <div className="flex justify-end mt-2 space-x-2">
              {order.status === "open" && (
                <Button
                  onClick={() => onSquareOff(order.id)}
                  size="icon"
                  variant="outline"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={() => onDeleteOrder(order.id)}
                size="icon"
                variant="outline"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderTableView = () => (
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
        {paginatedOrders.map((order) => {
          const profitLoss = calculateProfitLoss(order);
          const profitLossClass = getProfitLossClass(profitLoss);
          return (
            <TableRow key={order.id}>
              <TableCell>
                <Badge
                  style={{
                    background:
                      order?.orderDetails?.orderType === "limit"
                        ? "gray"
                        : "black",
                  }}
                >
                  {order?.orderDetails?.orderType?.toUpperCase() || "MARKET"}
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
              <TableCell>{order.amount.toFixed(8)}</TableCell>
              <TableCell>${order.price.toFixed(2)}</TableCell>
              <TableCell>
                ${order?.orderDetails?.target?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell>
                ${order?.orderDetails?.stopLoss?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={order.status === "open" ? "outline" : "secondary"}
                >
                  {order.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {order.closedPrice ? `$${order.closedPrice.toFixed(2)}` : "N/A"}
              </TableCell>
              <TableCell className={profitLossClass}>
                {profitLoss === "N/A"
                  ? profitLoss
                  : `${
                      profitLoss.startsWith("-")
                        ? "-$" + profitLoss.replace("-", "")
                        : "+$" + profitLoss
                    }`}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {order.status === "open" && (
                    <Button
                      onClick={() => onSquareOff(order.id)}
                      size="icon"
                      variant="outline"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => onDeleteOrder(order.id)}
                    size="icon"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Order History</CardTitle>
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
        <div
          className={`text-xl font-semibold mb-4 ${
            overallProfitLoss >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          Overall P/L: {overallProfitLoss >= 0 ? "+" : "-"}$
          {Math.abs(overallProfitLoss).toFixed(2)}
        </div>

        {isCardView ? renderCardView() : renderTableView()}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
