"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import Home from "../components/Home";
import { AUTH_LOGIN } from "@/constants/navigation";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect(AUTH_LOGIN);
  } 

  return <Home/>
}
