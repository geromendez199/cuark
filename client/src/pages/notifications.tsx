import { Layout } from "@/components/layout/layout";
import { Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_USERS } from "@/lib/mock-data";

export default function Notifications() {
  return (
    <Layout>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="font-bold text-xl">Notifications</h1>
          <div className="w-9 h-9 flex items-center justify-center hover:bg-accent rounded-full cursor-pointer transition-colors">
            <Settings className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-around h-12 px-4">
           <div className="relative flex items-center justify-center px-4 h-full cursor-pointer hover:bg-accent/50 transition-colors flex-1">
              <span className="font-bold text-sm">All</span>
              <div className="absolute bottom-0 h-1 w-8 bg-primary rounded-full"></div>
            </div>
            <div className="relative flex items-center justify-center px-4 h-full cursor-pointer hover:bg-accent/50 transition-colors flex-1 text-muted-foreground font-medium text-sm">
              <span>Verified</span>
            </div>
             <div className="relative flex items-center justify-center px-4 h-full cursor-pointer hover:bg-accent/50 transition-colors flex-1 text-muted-foreground font-medium text-sm">
              <span>Mentions</span>
            </div>
        </div>
      </div>

      <div>
        {MOCK_USERS.map((user, i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-border hover:bg-accent/5 transition-colors cursor-pointer">
            <div className="pt-1">
               <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary fill-current" aria-hidden="true"><g><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path></g></svg>
            </div>
            <div className="flex-1">
              <Avatar className="w-8 h-8 mb-2">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <p className="text-foreground text-[15px]">
                <span className="font-bold">{user.name}</span> followed you
              </p>
            </div>
          </div>
        ))}
         {MOCK_USERS.map((user, i) => (
          <div key={`like-${i}`} className="flex gap-4 p-4 border-b border-border hover:bg-accent/5 transition-colors cursor-pointer">
             <div className="pt-1">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-pink-600 fill-current" aria-hidden="true"><g><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.506.3-.506-.3C6.996 18.31 4.346 15.67 2.995 13.19c.456-2.06 1.824-3.79 3.66-4.62 2.775-1.25 5.345.83 5.345.83s2.57-2.08 5.345-.83c1.836.83 3.204 2.56 3.66 4.62zm-4.37-5.37c-1.693-.77-3.377.46-4.514 2.28l-1.526-1.06 1.526 1.06c-1.137-1.82-2.821-3.05-4.514-2.28-2.053.93-3.716 3.06-4.146 5.26 1.532 2.63 4.447 5.43 8.66 8.04 4.213-2.61 7.128-5.41 8.66-8.04-.43-2.2-2.093-4.33-4.146-5.26z"></path></g></svg>
            </div>
            <div className="flex-1">
              <Avatar className="w-8 h-8 mb-2">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <p className="text-foreground text-[15px]">
                <span className="font-bold">{user.name}</span> liked your reply
              </p>
               <p className="text-muted-foreground mt-2 text-[15px]">
                 Great insights on the new React features!
               </p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
