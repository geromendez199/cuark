import { 
  type User, 
  type InsertUser, 
  type Cuark,
  type InsertCuark,
  type CuarkWithAuthor,
  type UserWithStats,
  type InsertLike,
  type InsertRepost,
  type InsertFollow,
  type InsertNotification,
  users,
  cuarks,
  likes,
  reposts,
  follows,
  notifications
} from "@shared/schema";
import { db } from "../db/index";
import { eq, and, desc, sql, inArray, or } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getUserWithStats(id: string): Promise<UserWithStats | undefined>;
  
  // Cuark methods
  createCuark(cuark: InsertCuark): Promise<Cuark>;
  getCuark(id: number): Promise<CuarkWithAuthor | undefined>;
  getCuarks(userId?: string, limit?: number): Promise<CuarkWithAuthor[]>;
  getFeedCuarks(userId: string, limit?: number): Promise<CuarkWithAuthor[]>;
  deleteCuark(id: number, userId: string): Promise<boolean>;
  
  // Like methods
  likeCuark(userId: string, cuarkId: number): Promise<void>;
  unlikeCuark(userId: string, cuarkId: number): Promise<void>;
  
  // Repost methods
  repostCuark(userId: string, cuarkId: number): Promise<void>;
  unrepostCuark(userId: string, cuarkId: number): Promise<void>;
  
  // Follow methods
  followUser(followerId: string, followingId: string): Promise<void>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;
  
  // Notification methods
  createNotification(notification: InsertNotification): Promise<void>;
  getNotifications(userId: string, limit?: number): Promise<any[]>;
  markNotificationAsRead(id: number): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getUserWithStats(id: string): Promise<UserWithStats | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const [followersCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(eq(follows.followingId, id));

    const [followingCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(eq(follows.followerId, id));

    const [cuarksCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(cuarks)
      .where(eq(cuarks.authorId, id));

    return {
      ...user,
      followersCount: followersCount?.count || 0,
      followingCount: followingCount?.count || 0,
      cuarksCount: cuarksCount?.count || 0,
    };
  }

  // Cuark methods
  async createCuark(cuark: InsertCuark): Promise<Cuark> {
    const result = await db.insert(cuarks).values(cuark).returning();
    return result[0];
  }

  async getCuark(id: number): Promise<CuarkWithAuthor | undefined> {
    const result = await db
      .select({
        cuark: cuarks,
        author: users,
      })
      .from(cuarks)
      .leftJoin(users, eq(cuarks.authorId, users.id))
      .where(eq(cuarks.id, id))
      .limit(1);

    if (!result[0] || !result[0].author) return undefined;

    const [likesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(likes)
      .where(eq(likes.cuarkId, id));

    const [repostsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(reposts)
      .where(eq(reposts.cuarkId, id));

    const [repliesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(cuarks)
      .where(eq(cuarks.replyToId, id));

    return {
      ...result[0].cuark,
      author: result[0].author,
      likesCount: likesCount?.count || 0,
      repostsCount: repostsCount?.count || 0,
      repliesCount: repliesCount?.count || 0,
      viewsCount: Math.floor(Math.random() * 10000), // Mock views for now
    };
  }

  async getCuarks(userId?: string, limit: number = 50): Promise<CuarkWithAuthor[]> {
    const query = db
      .select({
        cuark: cuarks,
        author: users,
      })
      .from(cuarks)
      .leftJoin(users, eq(cuarks.authorId, users.id))
      .orderBy(desc(cuarks.createdAt))
      .limit(limit);

    const baseQuery = userId 
      ? query.where(eq(cuarks.authorId, userId))
      : query;

    const results = await baseQuery;

    return await Promise.all(
      results
        .filter(r => r.author !== null)
        .map(async (r) => {
          const [likesCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(likes)
            .where(eq(likes.cuarkId, r.cuark.id));

          const [repostsCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(reposts)
            .where(eq(reposts.cuarkId, r.cuark.id));

          const [repliesCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(cuarks)
            .where(eq(cuarks.replyToId, r.cuark.id));

          return {
            ...r.cuark,
            author: r.author!,
            likesCount: likesCount?.count || 0,
            repostsCount: repostsCount?.count || 0,
            repliesCount: repliesCount?.count || 0,
            viewsCount: Math.floor(Math.random() * 10000),
          };
        })
    );
  }

  async getFeedCuarks(userId: string, limit: number = 50): Promise<CuarkWithAuthor[]> {
    // Get users that the current user follows
    const following = await db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    const followingIds = following.map(f => f.followingId);
    followingIds.push(userId); // Include user's own cuarks

    if (followingIds.length === 0) {
      return this.getCuarks(undefined, limit);
    }

    const results = await db
      .select({
        cuark: cuarks,
        author: users,
      })
      .from(cuarks)
      .leftJoin(users, eq(cuarks.authorId, users.id))
      .where(inArray(cuarks.authorId, followingIds))
      .orderBy(desc(cuarks.createdAt))
      .limit(limit);

    return await Promise.all(
      results
        .filter(r => r.author !== null)
        .map(async (r) => {
          const [likesCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(likes)
            .where(eq(likes.cuarkId, r.cuark.id));

          const [repostsCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(reposts)
            .where(eq(reposts.cuarkId, r.cuark.id));

          const [repliesCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(cuarks)
            .where(eq(cuarks.replyToId, r.cuark.id));

          const [isLiked] = await db
            .select()
            .from(likes)
            .where(and(eq(likes.userId, userId), eq(likes.cuarkId, r.cuark.id)))
            .limit(1);

          const [isReposted] = await db
            .select()
            .from(reposts)
            .where(and(eq(reposts.userId, userId), eq(reposts.cuarkId, r.cuark.id)))
            .limit(1);

          return {
            ...r.cuark,
            author: r.author!,
            likesCount: likesCount?.count || 0,
            repostsCount: repostsCount?.count || 0,
            repliesCount: repliesCount?.count || 0,
            viewsCount: Math.floor(Math.random() * 10000),
            isLikedByUser: !!isLiked,
            isRepostedByUser: !!isReposted,
          };
        })
    );
  }

  async deleteCuark(id: number, userId: string): Promise<boolean> {
    const cuark = await db.select().from(cuarks).where(eq(cuarks.id, id)).limit(1);
    if (!cuark[0] || cuark[0].authorId !== userId) return false;

    await db.delete(cuarks).where(eq(cuarks.id, id));
    return true;
  }

  // Like methods
  async likeCuark(userId: string, cuarkId: number): Promise<void> {
    try {
      await db.insert(likes).values({ userId, cuarkId });
      
      // Create notification
      const cuark = await db.select().from(cuarks).where(eq(cuarks.id, cuarkId)).limit(1);
      if (cuark[0] && cuark[0].authorId !== userId) {
        await this.createNotification({
          userId: cuark[0].authorId,
          type: 'like',
          actorId: userId,
          cuarkId,
        });
      }
    } catch (error) {
      // Already liked, ignore
    }
  }

  async unlikeCuark(userId: string, cuarkId: number): Promise<void> {
    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.cuarkId, cuarkId)));
  }

  // Repost methods
  async repostCuark(userId: string, cuarkId: number): Promise<void> {
    try {
      await db.insert(reposts).values({ userId, cuarkId });
      
      // Create notification
      const cuark = await db.select().from(cuarks).where(eq(cuarks.id, cuarkId)).limit(1);
      if (cuark[0] && cuark[0].authorId !== userId) {
        await this.createNotification({
          userId: cuark[0].authorId,
          type: 'repost',
          actorId: userId,
          cuarkId,
        });
      }
    } catch (error) {
      // Already reposted, ignore
    }
  }

  async unrepostCuark(userId: string, cuarkId: number): Promise<void> {
    await db.delete(reposts).where(and(eq(reposts.userId, userId), eq(reposts.cuarkId, cuarkId)));
  }

  // Follow methods
  async followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) return;
    
    try {
      await db.insert(follows).values({ followerId, followingId });
      
      // Create notification
      await this.createNotification({
        userId: followingId,
        type: 'follow',
        actorId: followerId,
      });
    } catch (error) {
      // Already following, ignore
    }
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await db.delete(follows).where(
      and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))
    );
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .limit(1);
    return result.length > 0;
  }

  async getFollowers(userId: string): Promise<User[]> {
    const results = await db
      .select({ user: users })
      .from(follows)
      .leftJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, userId));
    
    return results.map(r => r.user).filter(u => u !== null) as User[];
  }

  async getFollowing(userId: string): Promise<User[]> {
    const results = await db
      .select({ user: users })
      .from(follows)
      .leftJoin(users, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, userId));
    
    return results.map(r => r.user).filter(u => u !== null) as User[];
  }

  // Notification methods
  async createNotification(notification: InsertNotification): Promise<void> {
    await db.insert(notifications).values(notification);
  }

  async getNotifications(userId: string, limit: number = 50): Promise<any[]> {
    const results = await db
      .select({
        notification: notifications,
        actor: users,
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.actorId, users.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    return results.map(r => ({
      ...r.notification,
      actor: r.actor,
    }));
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId));
  }
}

export const storage = new DatabaseStorage();
