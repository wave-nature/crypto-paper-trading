"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";
import useOrdersHook from "@/hooks/useOrders";
import { AUTH_LOGIN } from "@/constants/navigation";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import Navbar from "../components/Navbar";
import useAccountHook from "@/hooks/useAccount";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useAuthStore();
  const { getAllOrders } = useOrdersHook();
  const { getAccount } = useAccountHook();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (window.location.href.includes("auth")) return;

    if (!user) {
      getUser();
    } else {
      getAllOrders(user?.id);
    }
  }, []);

  async function getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data) {
        toast.error(error?.message || "User not found");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        window.location.href = AUTH_LOGIN;
      } else {
        const userId = data.user.id;
        const { data: account, error } = await getAccount(userId);
        if (error) throw error;
        if (!account) throw new Error("Account not found");
        setUser({
          id: data.user.id,
          name: data.user.user_metadata.name,
          email: data.user.email!,
          accountId: account.id,
          balance: account.balance,
          username: account.username,
        });

        // fetch orders
        await getAllOrders(userId);
      }
    } catch (err) {
      console.log("err", err);
    }
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
