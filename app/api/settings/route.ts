import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Order, Settings } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
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

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching settings:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: data || [],
    });
  } catch (error) {
    console.error("Unexpected error in settings API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const settings: Settings = body;

    if (!settings || !settings.user_id) {
      return NextResponse.json(
        { error: "Settings data with ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const setting = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", settings.user_id)
      .single();

    if (!setting.data) {
      const { data, error } = await supabase
        .from("settings")
        .insert(settings)
        .eq("user_id", settings.user_id)
        .select()
        .maybeSingle();
      if (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
          { error: "Failed to update order", details: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json({ data, success: true });
    } else {
      const { data, error } = await supabase
        .from("settings")
        .update(settings)
        .eq("user_id", settings.user_id)
        .select()
        .maybeSingle();
      if (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
          { error: "Failed to update order", details: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json({ data, success: true });
    }
  } catch (error) {
    console.error("Unexpected error in update order API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const settingsId = searchParams.get("settingsId");

    if (!settingsId) {
      return NextResponse.json(
        { error: "Settings ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("settings")
      .delete()
      .eq("id", settingsId);

    if (error) {
      console.error("Error deleting settings:", error);
      return NextResponse.json(
        { error: "Failed to delete settings", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error in delete order API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
