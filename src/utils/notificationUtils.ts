
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  related_entity_type?: string;
  related_entity_id?: string;
  created_at: string;
}

// Mock functions for notifications
// These would be replaced with actual implementations once the notifications table is created

export const createNotification = async (
  userId: string,
  data: {
    title: string;
    message: string;
    type: Notification['type'];
    related_entity_type?: string;
    related_entity_id?: string;
  }
): Promise<Notification | null> => {
  try {
    console.log(`Mock: Creating notification for user ${userId}`);
    
    return {
      id: `mock-${Date.now()}`,
      user_id: userId,
      title: data.title,
      message: data.message,
      type: data.type,
      is_read: false,
      related_entity_type: data.related_entity_type,
      related_entity_id: data.related_entity_id,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in createNotification:", error);
    return null;
  }
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    console.log(`Mock: Getting notifications for user ${userId}`);
    
    return [
      {
        id: `mock-${Date.now()}-1`,
        user_id: userId,
        title: "New Message",
        message: "You have a new message from John",
        type: 'info',
        is_read: false,
        related_entity_type: 'message',
        related_entity_id: 'mock-message-id',
        created_at: new Date().toISOString()
      },
      {
        id: `mock-${Date.now()}-2`,
        user_id: userId,
        title: "Rent Due",
        message: "Your rent payment is due in 3 days",
        type: 'warning',
        is_read: false,
        related_entity_type: 'payment',
        related_entity_id: 'mock-payment-id',
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    console.log(`Mock: Marking notification ${notificationId} as read`);
    return true;
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Mock: Marking all notifications as read for user ${userId}`);
    return true;
  } catch (error) {
    console.error("Error in markAllNotificationsAsRead:", error);
    return false;
  }
};

export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    console.log(`Mock: Getting unread notification count for user ${userId}`);
    return Math.floor(Math.random() * 5); // Return a random number between 0 and 4
  } catch (error) {
    console.error("Error in getUnreadNotificationsCount:", error);
    return 0;
  }
};
