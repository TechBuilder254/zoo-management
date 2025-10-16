import api from './api';

export interface SystemSettings {
  id?: string;
  site_name: string;
  site_description: string;
  max_booking_days: number;
  max_booking_quantity: number;
  maintenance_mode: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  auto_approve_bookings: boolean;
  currency: string;
  timezone: string;
  language: string;
  created_at?: string;
  updated_at?: string;
}

export const settingsService = {
  // Get all settings
  async getSettings(): Promise<SystemSettings> {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update settings
  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await api.put('/settings', settings);
    return response.data;
  },

  // Reset settings to default
  async resetSettings(): Promise<SystemSettings> {
    const response = await api.post('/settings/reset');
    return response.data;
  },

  // Clear all data (dangerous operation)
  async clearAllData(): Promise<void> {
    await api.delete('/settings/clear-data');
  }
};
