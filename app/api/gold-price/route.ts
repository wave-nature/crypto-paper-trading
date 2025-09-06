// app/api/gold-price/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  // instrument-price-last
  try {
    const response = await fetch("https://data-asg.goldprice.org/dbXRates/USD");
    if (!response.ok) {
      throw new Error("Failed to fetch gold price");
    }
    const data = await response.json();
    const price = data.items?.[0]?.xauPrice;
    // Optionally process data here if needed, but returning raw JSON is fine
    return NextResponse.json({ price });
  } catch (error) {
    console.error("Error fetching gold price:", error);
    return NextResponse.json(
      { error: "Failed to fetch gold price" },
      { status: 500 }
    );
  }
}
