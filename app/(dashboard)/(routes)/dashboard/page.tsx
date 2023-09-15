"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { constants } from "@/data";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// import useStoreUserEffect from "@/hooks/useStoreUserEffect";

export default function DashboardPage() {
  const router = useRouter();

  // if (userId === null) {
  //   return <div>Storing user...</div>;
  // }
  return (
    <div className="mt-40">
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-10" />
      <div className="mb-8 space-y-4 z-50 relative">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Discover the potential of AI.
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Have a conversation with the most intelligent AI - Witness the
          capabilities of AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-0 space-y-4 md:flex items-center justify-evenly w-full z-50 relative">
        {constants.map((item) => (
          <Card
            onClick={() => router.push(item.href)}
            key={item.href}
            className="px-8 mx-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer md:h-48 lg:w-1/3"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", item.bgColor)}>
                <item.icon className={cn("w-8 h-8", item.color)} />
              </div>
              <div className="font-semibold">{item.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
}
