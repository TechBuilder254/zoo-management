import { supabase } from '../config/supabase';

export interface NewsletterSubscription {
  email: string;
}

export const newsletterService = {
  subscribe: async (email: string): Promise<{ message: string }> => {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email, subscribed_at: new Date().toISOString() }]);

      if (error) {
        console.error('Error subscribing to newsletter:', error);
        throw error;
      }

      return { message: 'Successfully subscribed to newsletter!' };
    } catch (error) {
      console.error('Error in newsletterService.subscribe:', error);
      throw error;
    }
  },

  unsubscribe: async (email: string): Promise<{ message: string }> => {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('email', email);

      if (error) {
        console.error('Error unsubscribing from newsletter:', error);
        throw error;
      }

      return { message: 'Successfully unsubscribed from newsletter!' };
    } catch (error) {
      console.error('Error in newsletterService.unsubscribe:', error);
      throw error;
    }
  },
};

