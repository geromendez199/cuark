import { formatDistanceToNow } from "date-fns";

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  followers?: number;
  following?: number;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  likes: number;
  replies: number;
  reposts: number;
  views: number; // "X" specific metric
  image?: string;
}

export interface Trend {
  category: string;
  topic: string;
  postsCount: string;
}

export const CURRENT_USER: User = {
  id: "me",
  name: "Demo User",
  handle: "demo_user",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  bio: "Building cool things. Frontend enthusiast.",
  followers: 1205,
  following: 450
};

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Jane Doe",
    handle: "jane_doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    bio: "Digital artist & dreamer."
  },
  {
    id: "2",
    name: "Tech Insider",
    handle: "tech_insider",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
    bio: "Latest tech news and reviews."
  },
  {
    id: "3",
    name: "Alex Smith",
    handle: "alex_codes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    bio: "Coding nicely."
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    author: MOCK_USERS[0],
    content: "Just launched my new portfolio! Check it out 🚀 #webdev #design",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    likes: 42,
    replies: 5,
    reposts: 2,
    views: 1205,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
  },
  {
    id: "p2",
    author: MOCK_USERS[1],
    content: "The new React 19 features are looking incredibly promising. Server Actions are going to change the game. What do you think?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 856,
    replies: 124,
    reposts: 89,
    views: 15400
  },
  {
    id: "p3",
    author: MOCK_USERS[2],
    content: "Coffee first, code later. ☕️",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 230,
    replies: 12,
    reposts: 5,
    views: 4500
  },
  {
    id: "p4",
    author: CURRENT_USER,
    content: "Building a clone of this app right now! It's super fun to work with Tailwind and React.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 12,
    replies: 2,
    reposts: 0,
    views: 150
  }
];

export const TRENDS: Trend[] = [
  { category: "Technology · Trending", topic: "React 19", postsCount: "125K cuarks" },
  { category: "Sports · Trending", topic: "Championship", postsCount: "89.2K cuarks" },
  { category: "Entertainment · Trending", topic: "#NewMovie", postsCount: "45K cuarks" },
  { category: "Politics · Trending", topic: "Elections", postsCount: "2.1M cuarks" },
  { category: "Music · Trending", topic: "New Album", postsCount: "15.6K cuarks" }
];
