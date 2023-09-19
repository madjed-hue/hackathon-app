"use client";

import { FormEvent, useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export const SubscriptionButton = ({ isPro = false }: { isPro: boolean }) => {
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const userId = user?.id ?? "";

  const payOrUpdate = useAction(api.stripe.pay);

  const onClick = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const paymentUrl = await payOrUpdate({ userId });
      window.location.href = paymentUrl!;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isPro ? "default" : "premium"}
      disabled={loading}
      onClick={onClick}
    >
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  );
};
