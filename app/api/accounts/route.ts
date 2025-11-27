import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching account:", error);
      return NextResponse.json(
        { error: "Failed to fetch account", data: null },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Account not found", data: null },
        { status: 404 },
      );
    }

    return NextResponse.json({ data, error: null, success: true });
  } catch (error) {
    console.error("Unexpected error in get account API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, balance } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 },
      );
    }

    if (balance === undefined || balance === null) {
      return NextResponse.json(
        { error: "Balance is required" },
        { status: 400 },
      );
    }

    if (typeof balance !== "number") {
      return NextResponse.json(
        { error: "Balance must be a number" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("accounts")
      .update({ balance })
      .eq("id", accountId)
      .select()
      .single();

    if (error) {
      console.error("Error updating account balance:", error);
      return NextResponse.json(
        { error: "Failed to update balance", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error("Unexpected error in update account API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
