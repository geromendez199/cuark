import { Link, useLocation } from "wouter";
import { Home, Search, Bell, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Explore", href: "/explore" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Mail, label: "Messages", href: "/messages" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border sm:hidden z-50 pb-safe">
      <nav className="flex justify-around items-center h-14">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="p-2 cursor-pointer">
              <item.icon 
                className={cn(
                  "w-6 h-6 transition-colors",
                  location === item.href ? "stroke-[2.5px] text-foreground" : "text-muted-foreground"
                )} 
              />
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
