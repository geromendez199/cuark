import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { CURRENT_USER, MOCK_POSTS } from "@/lib/mock-data";
import { ArrowLeft, CalendarDays, Link as LinkIcon, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/ui/post-card";
import { Link } from "wouter";

export default function Profile() {
  return (
    <Layout>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 h-14 flex items-center gap-6 border-b border-border">
        <Link href="/">
          <div className="w-9 h-9 flex items-center justify-center hover:bg-accent rounded-full cursor-pointer transition-colors -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </div>
        </Link>
        <div>
          <h1 className="font-bold text-xl leading-5 font-display">{CURRENT_USER.name}</h1>
          <p className="text-xs text-muted-foreground">1,205 cuarks</p>
        </div>
      </div>

      {/* Banner */}
      <div className="h-[200px] bg-muted relative">
        <img 
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80" 
          alt="Banner" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 border-b border-border relative">
        <div className="flex justify-between items-start">
          <div className="-mt-[15%] sm:-mt-20 mb-3">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={CURRENT_USER.avatar} />
              <AvatarFallback>{CURRENT_USER.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <Button variant="outline" className="rounded-full font-bold mt-3 border-muted-foreground/30 hover:bg-accent/50">
            Edit profile
          </Button>
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-xl leading-tight">{CURRENT_USER.name}</h2>
          <p className="text-muted-foreground">@{CURRENT_USER.handle}</p>
        </div>

        <p className="mb-4 whitespace-pre-wrap">{CURRENT_USER.bio}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground text-[15px] mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-1">
            <LinkIcon className="w-4 h-4" />
            <a href="#" className="text-primary hover:underline">portfolio.dev</a>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>Joined September 2015</span>
          </div>
        </div>

        <div className="flex gap-4 text-[15px]">
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-foreground">{CURRENT_USER.following}</span> <span className="text-muted-foreground">Following</span>
          </div>
           <div className="hover:underline cursor-pointer">
            <span className="font-bold text-foreground">{CURRENT_USER.followers}</span> <span className="text-muted-foreground">Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <div className="relative flex items-center justify-center h-14 px-4 cursor-pointer hover:bg-white/5 transition-colors flex-1">
          <span className="font-bold text-sm font-display">Cuarks</span>
          <div className="absolute bottom-0 h-1 w-12 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]"></div>
        </div>
         <div className="relative flex items-center justify-center h-14 px-4 cursor-pointer hover:bg-white/5 transition-colors flex-1 text-muted-foreground font-medium text-sm font-display">
          <span className="hover:text-foreground transition-colors">Replies</span>
        </div>
         <div className="relative flex items-center justify-center h-14 px-4 cursor-pointer hover:bg-white/5 transition-colors flex-1 text-muted-foreground font-medium text-sm font-display">
          <span className="hover:text-foreground transition-colors">Highlights</span>
        </div>
         <div className="relative flex items-center justify-center h-14 px-4 cursor-pointer hover:bg-white/5 transition-colors flex-1 text-muted-foreground font-medium text-sm font-display">
          <span className="hover:text-foreground transition-colors">Media</span>
        </div>
         <div className="relative flex items-center justify-center h-14 px-4 cursor-pointer hover:bg-white/5 transition-colors flex-1 text-muted-foreground font-medium text-sm font-display">
          <span className="hover:text-foreground transition-colors">Likes</span>
        </div>
      </div>

      {/* User Posts */}
      <div>
        {MOCK_POSTS.filter(p => p.author.id === CURRENT_USER.id).map((post) => (
           <PostCard key={post.id} post={post} />
        ))}
        {/* Fill with other posts for demo */}
        {MOCK_POSTS.filter(p => p.author.id !== CURRENT_USER.id).map((post) => (
           <PostCard key={`p-${post.id}`} post={{...post, reposts: post.reposts + 1}} />
        ))}
      </div>
    </Layout>
  );
}
