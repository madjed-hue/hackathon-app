"use client";

import { Settings } from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const DAY_IN_MS = 86_400_000;

const SettingsPage = () => {
  const data = useQuery(api.userApiLimit.checkSubscription)!;

  const isPro =
    new Date(data?.stripeCurrentPeriodEnd!)?.getTime() + DAY_IN_MS > Date.now();

  return (
    <div className="relative z-50">
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are currently on a Pro plan."
            : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;
