import type { CuarkWithAuthor, UserWithStats, User } from "@shared/schema";

const API_BASE = "/api";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (data: { username: string; email: string; password: string; name: string }) =>
    apiRequest<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { username: string; password: string }) =>
    apiRequest<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest<{ success: boolean }>("/auth/logout", {
      method: "POST",
    }),

  me: () => apiRequest<UserWithStats>("/auth/me"),
};

// User API
export const userApi = {
  getUser: (id: string) => apiRequest<UserWithStats>(`/users/${id}`),
  getFollowers: (id: string) => apiRequest<User[]>(`/users/${id}/followers`),
  getFollowing: (id: string) => apiRequest<User[]>(`/users/${id}/following`),
  isFollowing: (id: string) => apiRequest<{ isFollowing: boolean }>(`/users/${id}/is-following`),
  follow: (id: string) =>
    apiRequest<{ success: boolean }>(`/users/${id}/follow`, {
      method: "POST",
    }),
  unfollow: (id: string) =>
    apiRequest<{ success: boolean }>(`/users/${id}/follow`, {
      method: "DELETE",
    }),
};

// Cuark API
export const cuarkApi = {
  create: (data: { content: string; imageUrl?: string; replyToId?: number }) =>
    apiRequest<CuarkWithAuthor>("/cuarks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getFeed: () => apiRequest<CuarkWithAuthor[]>("/cuarks/feed"),

  getCuarks: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : "";
    return apiRequest<CuarkWithAuthor[]>(`/cuarks${params}`);
  },

  getCuark: (id: number) => apiRequest<CuarkWithAuthor>(`/cuarks/${id}`),

  delete: (id: number) =>
    apiRequest<{ success: boolean }>(`/cuarks/${id}`, {
      method: "DELETE",
    }),

  like: (id: number) =>
    apiRequest<{ success: boolean }>(`/cuarks/${id}/like`, {
      method: "POST",
    }),

  unlike: (id: number) =>
    apiRequest<{ success: boolean }>(`/cuarks/${id}/like`, {
      method: "DELETE",
    }),

  repost: (id: number) =>
    apiRequest<{ success: boolean }>(`/cuarks/${id}/repost`, {
      method: "POST",
    }),

  unrepost: (id: number) =>
    apiRequest<{ success: boolean }>(`/cuarks/${id}/repost`, {
      method: "DELETE",
    }),
};

// Notification API
export const notificationApi = {
  getAll: () => apiRequest<any[]>("/notifications"),
  markAsRead: (id: number) =>
    apiRequest<{ success: boolean }>(`/notifications/${id}/read`, {
      method: "POST",
    }),
  markAllAsRead: () =>
    apiRequest<{ success: boolean }>("/notifications/read-all", {
      method: "POST",
    }),
};
