import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface TradingSummaryData {
  totalTrades: number;
  profitableTrades: number;
  lossTrades: number;
  mostProfitableTrade: number;
  mostLossTrade: number;
  overallPnl: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "today";
    const userId = searchParams.get("userId");

    // Validate inputs
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Create server-side Supabase client
    const supabase = await createSupabaseServerClient();

    // Build base query with common filters
    const buildBaseQuery = (selectData: any = {}) => {
      let query = supabase
        .from("orders")
        .select("*", selectData)
        .eq("user_id", userId)
        .eq("status", "closed");

      // Add date filter for "today" type
      if (type === "today") {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(
          today.setHours(23, 59, 59, 999),
        ).toISOString();
        query = query.gte("updated_at", startOfDay).lte("updated_at", endOfDay);
      }

      return query;
    };

    // Parallel execution of all queries
    const [
      profitableTradesResult,
      totalTradesResult,
      mostProfitableResult,
      mostLossResult,
      profitDataResult,
    ] = await Promise.all([
      // Count profitable trades
      buildBaseQuery({ count: "exact", head: true }).gte("profit", 0),

      // Count total trades
      buildBaseQuery({ count: "exact", head: true }),

      // Get most profitable trade
      buildBaseQuery()
        .select("profit")
        .gte("profit", 0)
        .order("profit", { ascending: false })
        .limit(1)
        .single(),

      // Get biggest loss trade
      buildBaseQuery()
        .select("profit")
        .lt("profit", 0)
        .order("profit", { ascending: true })
        .limit(1)
        .single(),

      // Get all profits for sum calculation (for today)
      // For overall, we'll use RPC
      type === "today"
        ? buildBaseQuery().select("profit")
        : Promise.resolve({ data: null, error: null }),
    ]);

    // Handle errors
    if (profitableTradesResult.error) {
      throw new Error(profitableTradesResult.error.message);
    }
    if (totalTradesResult.error) {
      throw new Error(totalTradesResult.error.message);
    }

    // Calculate values
    const totalTrades = totalTradesResult.count || 0;
    const profitableTrades = profitableTradesResult.count || 0;
    const lossTrades = totalTrades - profitableTrades;
    const mostProfitableTrade = mostProfitableResult.data?.profit || 0;
    const mostLossTrade = Math.abs(mostLossResult.data?.profit || 0);

    // Calculate overall P&L
    let overallPnl = 0;
    if (type === "today") {
      // Sum profits for today
      if (profitDataResult.error) {
        throw new Error(profitDataResult.error.message);
      }
      overallPnl =
        profitDataResult.data?.reduce(
          (acc, curr) => acc + (curr.profit || 0),
          0,
        ) || 0;
    } else {
      // Use RPC for overall
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_my_total_profit",
      );
      if (rpcError) {
        throw new Error(rpcError.message);
      }
      overallPnl = rpcData || 0;
    }

    const data: TradingSummaryData = {
      totalTrades,
      profitableTrades,
      lossTrades,
      mostProfitableTrade,
      mostLossTrade,
      overallPnl: Math.abs(overallPnl),
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unexpected error in trading summary API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
