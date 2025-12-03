import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CURRENT_USER } from "@/lib/mock-data";
import { Image, Smile, CalendarClock, MapPin, ListTodo, Sparkles } from "lucide-react";
import { useState } from "react";

interface ComposePostProps {
  onPost?: (content: string) => void;
}

export function ComposePost({ onPost }: ComposePostProps) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = () => {
    if (!content.trim()) return;
    
    setIsPosting(true);
    // Simulate network delay for "backend" feel
    setTimeout(() => {
      if (onPost) {
        onPost(content);
      }
      setContent("");
      setIsPosting(false);
    }, 600);
  };

  return (
    <div className="border-b border-white/10 p-4 flex gap-4 bg-background/20 backdrop-blur-sm">
      <Avatar className="w-11 h-11 ring-2 ring-primary/20">
        <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
        <AvatarFallback>{CURRENT_USER.name[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="mb-3">
          <textarea
            className="w-full bg-transparent text-xl placeholder:text-muted-foreground/50 border-none focus:ring-0 resize-none min-h-[50px] py-2 font-light"
            placeholder="Broadcast to the Cuarkverse..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
          />
        </div>
        
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-primary/80 hover:text-primary hover:bg-primary/10 rounded-full w-9 h-9 transition-all duration-300 hover:scale-110">
              <Image className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary/80 hover:text-primary hover:bg-primary/10 rounded-full w-9 h-9 transition-all duration-300 hover:scale-110">
              <ListTodo className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary/80 hover:text-primary hover:bg-primary/10 rounded-full w-9 h-9 transition-all duration-300 hover:scale-110">
              <Smile className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary/80 hover:text-primary hover:bg-primary/10 rounded-full w-9 h-9 transition-all duration-300 hover:scale-110">
              <CalendarClock className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary/80 hover:text-primary hover:bg-primary/10 rounded-full w-9 h-9 opacity-50 cursor-not-allowed">
              <MapPin className="w-5 h-5" />
            </Button>
          </div>
          
          <Button 
            size="sm" 
            className="rounded-full px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300" 
            disabled={!content.trim() || isPosting}
            onClick={handlePost}
          >
            {isPosting ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              "Cuark"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
