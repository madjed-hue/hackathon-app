"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FreeCounter } from "@/components/free-counter";

const poppins = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-amber-500",
  },
  {
    label: "Chat Generation",
    icon: MessageSquare,
    href: "/chat",
    color: "text-emerald-500",
  },
  {
    label: "Pictures Generation",
    icon: ImageIcon,
    color: "text-blue-400",
    href: "/picture",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-fuchsia-500",
    href: "/code",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

const DAY_IN_MS = 86_400_000;

export const Sidebar = () => {
  const pathname = usePathname();

  const apiLimitCount = useQuery(api.userApiLimit.getApiLimitCount);

  const data = useQuery(api.userApiLimit.checkSubscription)!;

  const isPro =
    new Date(data?.stripeCurrentPeriodEnd!)?.getTime() + DAY_IN_MS > Date.now();

  return (
    <div className="py-8 flex flex-col h-full text-gray-800 relative z-[110]">
      <div className="px-3 py-2 flex-1 z-[80] h-full">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", poppins.className)}>
            MindMeld
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-balck hover:bg-black/20 rounded-lg transition",
                pathname === route.href
                  ? "text-black bg-black/20"
                  : "text-zinc-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter apiLimitCount={apiLimitCount} isPro={isPro} />
    </div>
  );
};
