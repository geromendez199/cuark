import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { CuarkWithAuthor } from "@shared/schema";
import { Heart, MessageCircle, Repeat2, Share, BarChart2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cuarkApi } from "@/lib/api";

interface PostCardProps {
  post: CuarkWithAuthor;
  currentUserId?: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(post.isLikedByUser || false);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [isReposted, setIsReposted] = useState(post.isRepostedByUser || false);
  const [repostCount, setRepostCount] = useState(post.repostsCount);

  const likeMutation = useMutation({
    mutationFn: (cuarkId: number) => isLiked ? cuarkApi.unlike(cuarkId) : cuarkApi.like(cuarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuarks"] });
    },
  });

  const repostMutation = useMutation({
    mutationFn: (cuarkId: number) => isReposted ? cuarkApi.unrepost(cuarkId) : cuarkApi.repost(cuarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuarks"] });
    },
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    likeMutation.mutate(post.id);
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setRepostCount(prev => isReposted ? prev - 1 : prev + 1);
    repostMutation.mutate(post.id);
  };

  return (
    <div className="border-b border-white/5 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer pb-2">
      <div className="flex gap-3 p-4">
        <Avatar className="w-10 h-10 ring-1 ring-white/10 transition-transform hover:scale-105">
          <AvatarImage src={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`} alt={post.author.name} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 truncate">
              <span className="font-bold text-foreground hover:underline truncate font-display">{post.author.name}</span>
              <span className="text-muted-foreground truncate text-sm">@{post.author.username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm hover:underline">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }).replace("about ", "").replace(" hours", "h").replace(" minutes", "m").replace(" minute", "m").replace(" seconds", "s")}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full hover:bg-primary/10 hover:text-primary">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-1 text-foreground/90 whitespace-pre-wrap text-[15px] leading-relaxed font-normal">
            {post.content}
          </div>

          {post.imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[500px] hover:scale-[1.01] transition-transform duration-500" />
            </div>
          )}

          <div className="flex justify-between items-center mt-3 max-w-[425px]">
            <Button variant="ghost" size="sm" className="group -ml-2 px-2 text-muted-foreground hover:text-primary hover:bg-transparent">
              <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs ml-1 font-mono">{post.repliesCount}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("group px-2 hover:bg-transparent", isReposted ? "text-green-400" : "text-muted-foreground hover:text-green-400")}
              onClick={(e) => { e.stopPropagation(); handleRepost(); }}
              disabled={!currentUserId}
            >
              <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                <Repeat2 className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <span className="text-xs ml-1 font-mono">{repostCount}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("group px-2 hover:bg-transparent", isLiked ? "text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" : "text-muted-foreground hover:text-pink-500")}
              onClick={(e) => { e.stopPropagation(); handleLike(); }}
              disabled={!currentUserId}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <Heart className={cn("w-4 h-4 group-hover:scale-110 transition-transform", isLiked && "fill-current")} />
              </div>
              <span className="text-xs ml-1 font-mono">{likeCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="group px-2 text-muted-foreground hover:text-primary hover:bg-transparent">
              <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-xs ml-1 font-mono">{post.viewsCount > 1000 ? (post.viewsCount / 1000).toFixed(1) + 'k' : post.viewsCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="group px-2 text-muted-foreground hover:text-primary hover:bg-transparent">
              <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
