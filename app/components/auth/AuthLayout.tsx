"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";
import useOrdersHook from "@/hooks/useOrders";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import useAccountHook from "@/hooks/useAccount";
import useSettingsHook from "@/hooks/useSettings";
import useSettings from "@/store/useSettings";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useAuthStore();
  const { getAllOrders } = useOrdersHook();
  const { getAccount } = useAccountHook();
  const { getSettings } = useSettingsHook();
  const { setSettings } = useSettings();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (window.location.href.includes("auth")) return;

    if (!user) {
      getUser();
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      getAllOrders(user?.id);
      getSettings(user?.id).then((res) => {
        const { data, error } = res;
        if (error) {
          toast.error(error.message);
        } else {
          const payload = {
            enableScreenshot: Boolean(data.enable_screenshot),
          };
          setSettings(payload);
        }
      });
    }
  }, [user?.id]);

  async function getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data) {
        throw new Error("User not found");
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
  return <>{children}</>;
}
