"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { AnimatedContainer } from "./AnimatedContainer";
import { Home, MapPin, Users, BarChart3, Settings, LogOut } from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Properties", href: "/properties", icon: MapPin },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-2", className)}>
      {navigationItems.map((item, index) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <AnimatedContainer
            key={item.name}
            direction="left"
            delay={0.1 * index}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          </AnimatedContainer>
        );
      })}

      <AnimatedContainer direction="left" delay={0.6}>
        <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200 w-full">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </AnimatedContainer>
    </nav>
  );
};
