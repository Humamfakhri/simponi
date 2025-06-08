"use client";
import { ChartColumn, CircleGauge, Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const menuItems = [
    { href: "/", label: "Dashboard", urlPathname: "", icon: <CircleGauge className="size-5" /> },
    { href: "/histori", label: "Histori", urlPathname: "histori", icon: <ChartColumn className="size-5" /> },
    // { href: "/notifikasi", label: "Notifikasi", urlPathname: "notifikasi", icon: <Bell className="size-5" /> },
    { href: "/pengaturan", label: "Pengaturan", urlPathname: "pengaturan", icon: <Settings2 className="size-5" /> },
  ];

  const pathname = usePathname();
  return (
    <ul className="hidden lg:flex lg:flex-col gap-5 sticky top-0 pt-4 mt-13">
      {menuItems.map(({ href, label, urlPathname, icon }) => {
        const isActive = pathname.split('/')[1] === urlPathname;
        return (
          <li key={href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={href}>
                  <Button variant={isActive ? "dark" : "glass"} className="flex items-center justify-center size-12 rounded-full">
                    {icon}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent align="center" side="right">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  )
}
