export interface Order {
  id: number;
  type: "buy" | "sell";
  symbol: string;
  amount: number;
  price: number;
  timestamp: number;
  status: "open" | "closed" | "pending";
  orderDetails: {
    orderType: "market" | "limit";
    limitPrice?: number;
    stopLoss?: number;
    target?: number;
  };
  closedPrice?: number;
  profit?: number;
}