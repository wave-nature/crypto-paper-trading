export type Symbols = "sol" | "btc" | "eth" | "xauusd";
export type SymbolsUpperCase = "SOL" | "BTC" | "ETH" | "XAUUSD";
export type OrderTabs = "pending" | "open" | "closed" | "all";

export interface Order {
  id?: string;
  type: "buy" | "sell";
  symbol: SymbolsUpperCase | "";
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
  updated_at?: string;
  created_at?: string;
}

export type OpenOrders = Symbols[];
