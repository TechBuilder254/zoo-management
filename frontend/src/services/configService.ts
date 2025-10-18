// Service to fetch environment variables from backend
class ConfigService {
  private static instance: ConfigService;
  private config: Record<string, any> = {};
  private isLoaded = false;

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public async loadConfig(): Promise<void> {
    if (this.isLoaded) return;

    try {
        // Try to fetch from backend first
        const backendUrl = '/api/config/env';
        
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const text = await response.text();
        console.log('Backend response received');
        
        try {
          const data = JSON.parse(text);
          if (data && typeof data === 'object') {
            // Handle Upstash Redis REST API response format
            if (data.value) {
              const configData = JSON.parse(data.value);
              this.config = configData;
            } else {
              this.config = data;
            }
            this.isLoaded = true;
            console.log('✅ Config loaded from backend successfully');
            return;
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response text:', text);
        }
      } else {
        console.error('Backend response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.warn('Failed to load config from backend, using fallbacks:', error);
    }

    // Fallback to process.env for development and production
    this.config = {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL || '/api',
      REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
      REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
      REACT_APP_EMAIL_REDIRECT_URL: process.env.REACT_APP_EMAIL_REDIRECT_URL || window.location.origin,
      REACT_APP_HUGGINGFACE_API_KEY: process.env.REACT_APP_HUGGINGFACE_API_KEY,
      REACT_APP_ENABLE_SENTIMENT_ANALYSIS: process.env.REACT_APP_ENABLE_SENTIMENT_ANALYSIS === 'true',
      REACT_APP_ENABLE_CONTENT_MODERATION: process.env.REACT_APP_ENABLE_CONTENT_MODERATION === 'true',
      REACT_APP_ENABLE_CHATBOT: process.env.REACT_APP_ENABLE_CHATBOT === 'true',
      REACT_APP_SENTIMENT_THRESHOLD: parseFloat(process.env.REACT_APP_SENTIMENT_THRESHOLD || '0.7'),
      REACT_APP_TOXICITY_THRESHOLD: parseFloat(process.env.REACT_APP_TOXICITY_THRESHOLD || '0.8'),
      REACT_APP_STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
      REACT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      // Ticket prices and contact info are managed through admin panel, not environment variables
    };
    this.isLoaded = true;
  }

  public get(key: string): any {
    return this.config[key];
  }

  public getAll(): Record<string, any> {
    return { ...this.config };
  }
}

export const configService = ConfigService.getInstance();
export default configService;
