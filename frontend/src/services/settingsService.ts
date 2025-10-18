import { supabase } from '../config/supabase';

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
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        // Return default settings if none exist
        return {
          site_name: 'Wildlife Zoo',
          site_description: 'Experience the wonders of wildlife',
          max_booking_days: 30,
          max_booking_quantity: 10,
          maintenance_mode: false,
          email_notifications: true,
          sms_notifications: false,
          auto_approve_bookings: true,
          currency: 'KSh',
          timezone: 'Africa/Nairobi',
          language: 'en',
        };
      }

      return data;
    } catch (error) {
      console.error('Error in settingsService.getSettings:', error);
      throw error;
    }
  },

  // Update settings
  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating settings:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in settingsService.updateSettings:', error);
      throw error;
    }
  },

  // Reset settings to default
  async resetSettings(): Promise<SystemSettings> {
    try {
      const defaultSettings = {
        site_name: 'Wildlife Zoo',
        site_description: 'Experience the wonders of wildlife',
        max_booking_days: 30,
        max_booking_quantity: 10,
        maintenance_mode: false,
        email_notifications: true,
        sms_notifications: false,
        auto_approve_bookings: true,
        currency: 'KSh',
        timezone: 'Africa/Nairobi',
        language: 'en',
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('system_settings')
        .update(defaultSettings)
        .select()
        .single();

      if (error) {
        console.error('Error resetting settings:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in settingsService.resetSettings:', error);
      throw error;
    }
  },

  // Clear all data (dangerous operation)
  async clearAllData(): Promise<void> {
    try {
      // This is a dangerous operation - in a real app, you'd want additional safeguards
      console.warn('Clearing all data - this is a dangerous operation!');
      // Implementation would depend on your specific requirements
    } catch (error) {
      console.error('Error in settingsService.clearAllData:', error);
      throw error;
    }
  }
};
