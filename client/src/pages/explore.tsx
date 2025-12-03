import { Layout } from "@/components/layout/layout";
import { Input } from "@/components/ui/input";
import { Search, Settings } from "lucide-react";
import { TRENDS } from "@/lib/mock-data";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Explore() {
  return (
    <Layout>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-2 flex items-center gap-4 border-b border-border">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary" />
          <Input 
            placeholder="Search" 
            className="pl-11 rounded-full bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background h-10" 
          />
        </div>
        <div className="w-9 h-9 flex items-center justify-center hover:bg-accent rounded-full cursor-pointer transition-colors">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      <div className="border-b border-border">
        <img 
          src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" 
          alt="Explore Hero" 
          className="w-full h-[200px] object-cover"
        />
        <div className="p-4 -mt-16 relative z-10 bg-gradient-to-t from-black/80 to-transparent pt-16 text-white">
          <p className="text-xs font-bold uppercase mb-1">Event · LIVE</p>
          <h1 className="text-2xl font-bold">Tech Week 2025 is happening now</h1>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-xl mb-4">Trends for you</h2>
        <div className="space-y-6">
          {TRENDS.map((trend, i) => (
            <div key={i} className="flex justify-between items-start cursor-pointer">
              <div>
                <div className="text-sm text-muted-foreground mb-0.5">{trend.category}</div>
                <div className="font-bold text-base mb-0.5">{trend.topic}</div>
                <div className="text-sm text-muted-foreground">{trend.postsCount}</div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
