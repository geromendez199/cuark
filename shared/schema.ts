import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  bannerImage: text("banner_image"),
  location: text("location"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cuarks: ReturnType<typeof pgTable> = pgTable("cuarks", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  replyToId: integer("reply_to_id"),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cuarkId: integer("cuark_id").notNull().references(() => cuarks.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reposts = pgTable("reposts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cuarkId: integer("cuark_id").notNull().references(() => cuarks.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: text("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: text("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  actorId: text("actor_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cuarkId: integer("cuark_id").references(() => cuarks.id, { onDelete: "cascade" }),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  cuarks: many(cuarks),
  likes: many(likes),
  reposts: many(reposts),
  followers: many(follows, { relationName: "following" }),
  following: many(follows, { relationName: "follower" }),
  notifications: many(notifications),
}));

export const cuarksRelations = relations(cuarks, ({ one, many }) => ({
  author: one(users, {
    fields: [cuarks.authorId],
    references: [users.id],
  }),
  likes: many(likes),
  reposts: many(reposts),
  replies: many(cuarks, { relationName: "replies" }),
  replyTo: one(cuarks, {
    fields: [cuarks.replyToId],
    references: [cuarks.id],
    relationName: "replies"
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  cuark: one(cuarks, {
    fields: [likes.cuarkId],
    references: [cuarks.id],
  }),
}));

export const repostsRelations = relations(reposts, ({ one }) => ({
  user: one(users, {
    fields: [reposts.userId],
    references: [users.id],
  }),
  cuark: one(cuarks, {
    fields: [reposts.cuarkId],
    references: [cuarks.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follower"
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "following"
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  actor: one(users, {
    fields: [notifications.actorId],
    references: [users.id],
  }),
  cuark: one(cuarks, {
    fields: [notifications.cuarkId],
    references: [cuarks.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  name: z.string().min(1).max(50),
}).omit({ id: true, createdAt: true });

export const insertCuarkSchema = createInsertSchema(cuarks, {
  content: z.string().min(1).max(500),
}).omit({ id: true, createdAt: true });

export const insertLikeSchema = createInsertSchema(likes).omit({ id: true, createdAt: true });
export const insertRepostSchema = createInsertSchema(reposts).omit({ id: true, createdAt: true });
export const insertFollowSchema = createInsertSchema(follows).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCuark = z.infer<typeof insertCuarkSchema>;
export type Cuark = typeof cuarks.$inferSelect;

export type InsertLike = z.infer<typeof insertLikeSchema>;
export type Like = typeof likes.$inferSelect;

export type InsertRepost = z.infer<typeof insertRepostSchema>;
export type Repost = typeof reposts.$inferSelect;

export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Follow = typeof follows.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Extended types with relations
export type CuarkWithAuthor = Cuark & {
  author: User;
  likesCount: number;
  repostsCount: number;
  repliesCount: number;
  viewsCount: number;
  isLikedByUser?: boolean;
  isRepostedByUser?: boolean;
};

export type UserWithStats = User & {
  followersCount: number;
  followingCount: number;
  cuarksCount: number;
};
