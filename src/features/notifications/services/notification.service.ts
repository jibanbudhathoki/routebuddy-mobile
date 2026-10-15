import { apiEndpoints } from "../../../constant/url";
import { apiRequest } from "../../../shared/api/apiClient";
import type { AppNotification } from "../types/notification";
import { notificationsEnvelopeSchema } from "../validations/notification";

export const notificationService = {
  async list(): Promise<AppNotification[]> {
    const response = await apiRequest<unknown>(
      apiEndpoints.notifications.listNotifications,
      { method: "GET" },
    );
    const parsed = notificationsEnvelopeSchema.parse(response);
    if (!parsed.success) {
      throw new Error(parsed.message || "Unable to load notifications.");
    }
    if (!parsed.data) {
      throw new Error("The notifications response did not include a list.");
    }
    return parsed.data;
  },

  async markAsRead(id: string): Promise<void> {
    if (!id.trim()) {
      throw new Error("A notification ID is required.");
    }
    await apiRequest<unknown>(
      apiEndpoints.notifications.markAsRead.replace(
        ":id",
        encodeURIComponent(id),
      ),
      { method: "POST" },
    );
  },

  async markAllAsRead(): Promise<void> {
    await apiRequest<unknown>(apiEndpoints.notifications.markAllAsRead, {
      method: "POST",
    });
  },
};
