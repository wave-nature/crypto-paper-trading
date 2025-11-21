export interface Order {
  id?: string;
  type: "buy" | "sell";
  symbol: string;
  quantity: number;
  price: number;
  timestamp: string;
  status: "open" | "closed" | "pending";
  order_details: {
    orderType: "market" | "limit";
    limitPrice?: number;
    stopLoss?: number;
    target?: number;
  };
  closed_price?: number;
  profit?: number;
  user_id?: string;
}
