import { Code, ImageIcon, MessageSquare } from "lucide-react";

export const MAX_FREE_COUNTS = 5;

export const constants = [
  {
    label: "Chat Generation",
    icon: MessageSquare,
    href: "/chat",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Picture Generation",
    icon: ImageIcon,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    href: "/picture",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
    href: "/code",
  },
];
