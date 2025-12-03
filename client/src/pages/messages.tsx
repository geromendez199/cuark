import { Layout } from "@/components/layout/layout";
import { Settings, MailPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_USERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function Messages() {
  return (
    <Layout>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="font-bold text-xl">Messages</h1>
          <div className="flex items-center gap-2">
             <div className="w-9 h-9 flex items-center justify-center hover:bg-accent rounded-full cursor-pointer transition-colors">
                <Settings className="w-5 h-5" />
             </div>
             <div className="w-9 h-9 flex items-center justify-center hover:bg-accent rounded-full cursor-pointer transition-colors">
                <MailPlus className="w-5 h-5" />
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 pb-0">
        <h2 className="text-3xl font-extrabold mb-2">Welcome to your inbox!</h2>
        <p className="text-muted-foreground mb-6">Drop a line, share Cuarks and more with private conversations between you and others on Cuark.</p>
        <Button className="rounded-full font-bold h-12 px-8 text-lg mb-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300">
          Write a message
        </Button>
      </div>
      
      <div className="border-t border-border">
        {MOCK_USERS.map((user, i) => (
           <div key={i} className="flex gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1 truncate">
                    <span className="font-bold truncate">{user.name}</span>
                    <span className="text-muted-foreground text-sm truncate">@{user.handle}</span>
                    <span className="text-muted-foreground text-sm">· 2h</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-[15px] truncate">
                  Hey, did you see the latest update? It's amazing!
                </p>
              </div>
           </div>
        ))}
      </div>
    </Layout>
  );
}
