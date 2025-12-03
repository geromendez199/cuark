import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal } from "lucide-react";
import { TRENDS, MOCK_USERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RightSidebar() {
  return (
    <div className="flex flex-col gap-4 h-full py-2 pl-4">
      {/* Search */}
      <div className="sticky top-0 bg-background z-10 pb-2">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary" />
          <Input 
            placeholder="Search" 
            className="pl-11 rounded-full bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background h-10" 
          />
        </div>
      </div>

      {/* Trends */}
      <div className="bg-secondary/50 rounded-2xl border border-border p-4">
        <h2 className="font-bold text-xl mb-4 px-2">What's happening</h2>
        <div className="space-y-4">
          {TRENDS.map((trend, i) => (
            <div key={i} className="px-2 hover:bg-accent/50 cursor-pointer transition-colors py-2 -mx-2 rounded-lg relative group">
              <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                <span>{trend.category}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
              <div className="font-bold text-sm mb-0.5">{trend.topic}</div>
              <div className="text-xs text-muted-foreground">{trend.postsCount}</div>
            </div>
          ))}
        </div>
        <Button variant="link" className="text-primary px-2 mt-2 justify-start h-auto p-0">
          Show more
        </Button>
      </div>

      {/* Who to follow */}
      <div className="bg-secondary/50 rounded-2xl border border-border p-4">
        <h2 className="font-bold text-xl mb-4 px-2">Who to follow</h2>
        <div className="space-y-4">
          {MOCK_USERS.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-2 py-2 -mx-2 hover:bg-accent/50 rounded-lg cursor-pointer transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate hover:underline">{user.name}</p>
                <p className="text-muted-foreground text-xs truncate">@{user.handle}</p>
              </div>
              <Button size="sm" variant="secondary" className="rounded-full font-bold h-8 px-4 bg-foreground text-background hover:bg-foreground/90 hover:text-background">
                Follow
              </Button>
            </div>
          ))}
        </div>
        <Button variant="link" className="text-primary px-2 mt-2 justify-start h-auto p-0">
          Show more
        </Button>
      </div>
      
      <div className="px-4 text-xs text-muted-foreground leading-5">
        <span className="hover:underline cursor-pointer mr-2">Terms of Service</span>
        <span className="hover:underline cursor-pointer mr-2">Privacy Policy</span>
        <span className="hover:underline cursor-pointer mr-2">Cookie Policy</span>
        <span className="hover:underline cursor-pointer mr-2">Accessibility</span>
        <span className="hover:underline cursor-pointer mr-2">Ads info</span>
        <span className="hover:underline cursor-pointer mr-2">More...</span>
        <span>© 2025 Pulse Corp.</span>
      </div>
    </div>
  );
}
