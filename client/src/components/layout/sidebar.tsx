import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Search, Bell, Mail, User, MoreHorizontal, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CURRENT_USER } from "@/lib/mock-data";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Explore", href: "/explore" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6 px-2">
        <Link href="/">
          <div className="w-10 h-10 bg-transparent text-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-all duration-300 group">
            <Atom className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
          </div>
        </Link>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-full cursor-pointer transition-all duration-200 w-max xl:w-auto group",
                location === item.href 
                  ? "font-bold text-primary bg-primary/5" 
                  : "text-foreground/80 hover:bg-white/5 hover:text-primary"
              )}
            >
              <item.icon className={cn(
                "w-7 h-7 transition-transform group-hover:scale-110", 
                location === item.href ? "fill-current drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : ""
              )} />
              <span className="hidden xl:inline text-xl pr-4 font-display tracking-wide">{item.label}</span>
            </div>
          </Link>
        ))}
        
        <Button className="w-full h-14 rounded-full mt-8 text-lg font-bold shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] hidden xl:block bg-primary text-primary-foreground hover:scale-[1.02] transition-all duration-300 hover:bg-primary/90">
          Cuark
        </Button>
        <Button size="icon" className="w-14 h-14 rounded-full mt-8 shadow-lg xl:hidden flex items-center justify-center bg-primary hover:bg-primary/90">
          <Atom className="w-6 h-6" />
        </Button>
      </nav>

      <div className="mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-full hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
            <AvatarImage src={CURRENT_USER.avatar} />
            <AvatarFallback>{CURRENT_USER.name[0]}</AvatarFallback>
          </Avatar>
          <div className="hidden xl:block flex-1 min-w-0">
            <p className="font-bold text-sm truncate font-display">{CURRENT_USER.name}</p>
            <p className="text-muted-foreground text-sm truncate">@{CURRENT_USER.handle}</p>
          </div>
          <MoreHorizontal className="w-5 h-5 hidden xl:block ml-2 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
