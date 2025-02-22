"use client";

import { useState } from "react";
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

  const calculateProfitLoss = (order: Order) => {
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

  const renderCardView = () => (
    <div className="space-y-4">
      {orders.map((order) => {
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
          <TableHead>Type</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Closed Price</TableHead>
          <TableHead>Profit/Loss</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const profitLoss = calculateProfitLoss(order);
          const profitLossClass = getProfitLossClass(profitLoss);
          return (
            <TableRow key={order.id}>
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
                  : `${profitLoss.startsWith("-") ? "" : "+"}$${profitLoss}`}
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
      </CardContent>
    </Card>
  );
}
