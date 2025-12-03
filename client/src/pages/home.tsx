import { Layout } from "@/components/layout/layout";
import { ComposePost } from "@/components/ui/compose-post";
import { PostCard } from "@/components/ui/post-card";
import { Settings, Sparkles, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cuarkApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  const { data: cuarks, isLoading } = useQuery({
    queryKey: ["cuarks", "feed"],
    queryFn: () => cuarkApi.getFeed(),
    enabled: isAuthenticated,
  });

  const createCuarkMutation = useMutation({
    mutationFn: cuarkApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuarks"] });
    },
  });

  const handleNewPost = (content: string) => {
    createCuarkMutation.mutate({ content });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="sticky top-0 z-20 glass">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex-1 flex justify-around h-full">
            <div className="relative flex items-center justify-center px-4 h-full cursor-pointer hover:bg-white/5 transition-colors flex-1 group">
              <span className="font-bold text-sm font-display group-hover:text-primary transition-colors">For you</span>
              <div className="absolute bottom-0 h-1 w-14 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]"></div>
            </div>
            <div className="relative flex items-center justify-center px-4 h-full cursor-pointer hover:bg-white/5 transition-colors flex-1 text-muted-foreground font-medium text-sm font-display">
              <span className="hover:text-foreground transition-colors">Following</span>
            </div>
          </div>
          <div className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full cursor-pointer transition-colors ml-2">
            <Settings className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
      
      <ComposePost onPost={handleNewPost} />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 sm:pb-0">
        {isLoading && (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (!cuarks || cuarks.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No cuarks yet. Be the first to initiate the sequence.</p>
          </div>
        )}

        {cuarks?.map((cuark) => (
          <PostCard key={cuark.id} post={cuark} currentUserId={user.id} />
        ))}
      </div>
    </Layout>
  );
}
