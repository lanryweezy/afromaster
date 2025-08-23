// Analytics Service for tracking user interactions and business metrics
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean>;
}

export interface UserProperties {
  user_type: 'free' | 'premium' | 'pro';
  genre_preference?: string;
  mastering_credits?: number;
  country?: string;
  device_type?: 'mobile' | 'desktop' | 'tablet';
}

class AnalyticsService {
  private isInitialized = false;
  private userId: string | null = null;
  private userProperties: UserProperties = {
    user_type: 'free',
    device_type: this.getDeviceType()
  };

  constructor() {
    this.initializeAnalytics();
  }

  private initializeAnalytics() {
    if (typeof window !== 'undefined' && window.gtag) {
      this.isInitialized = true;
      console.log('Analytics initialized successfully');
    } else {
      console.warn('Google Analytics not available');
    }
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';
    
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'mobile';
    }
    if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  // Track page views
  trackPageView(pageName: string, pagePath?: string) {
    if (!this.isInitialized) return;

    const pageData = {
      page_title: pageName,
      page_location: pagePath || window.location.href,
      custom_parameter_1: this.userProperties.user_type,
      custom_parameter_2: this.userProperties.genre_preference || 'none',
      custom_parameter_3: this.userProperties.mastering_credits || 0
    };

    window.gtag('config', 'G-TRACKING-ID', pageData);
    
    // Track custom event
    this.trackEvent({
      action: 'page_view',
      category: 'navigation',
      label: pageName,
      custom_parameters: pageData
    });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized) return;

    const eventData = {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    };

    window.gtag('event', event.action, eventData);
  }

  // Track user registration
  trackUserRegistration(userId: string, userType: 'free' | 'premium' | 'pro') {
    this.userId = userId;
    this.userProperties.user_type = userType;

    this.trackEvent({
      action: 'sign_up',
      category: 'user_engagement',
      label: userType,
      custom_parameters: {
        user_id: userId,
        user_type: userType
      }
    });
  }

  // Track file upload
  trackFileUpload(fileSize: number, fileType: string, genre?: string) {
    this.trackEvent({
      action: 'file_upload',
      category: 'audio_processing',
      label: fileType,
      value: fileSize,
      custom_parameters: {
        file_size_mb: Math.round(fileSize / (1024 * 1024) * 100) / 100,
        file_type: fileType,
        genre: genre || 'unknown'
      }
    });
  }

  // Track mastering settings
  trackMasteringSettings(settings: import('../types').MasteringSettings) {
    this.trackEvent({
      action: 'mastering_settings_configured',
      category: 'audio_processing',
      label: settings.genre || 'unknown',
      custom_parameters: {
        genre: settings.genre,
        loudness_target: settings.loudnessTarget,
        stereo_width: settings.stereoWidth,
        compression_amount: settings.compressionAmount,
        saturation_amount: settings.saturationAmount,
        ai_settings_applied: settings.aiSettingsApplied || false
      }
    });
  }

  // Track mastering completion
  trackMasteringCompletion(duration: number, genre: string, quality: number) {
    this.trackEvent({
      action: 'mastering_completed',
      category: 'audio_processing',
      label: genre,
      value: quality,
      custom_parameters: {
        processing_duration_seconds: Math.round(duration / 1000),
        genre: genre,
        quality_score: quality,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Track download
  trackDownload(genre: string, quality: number, isFree: boolean) {
    this.trackEvent({
      action: 'track_downloaded',
      category: 'conversion',
      label: genre,
      value: quality,
      custom_parameters: {
        genre: genre,
        quality_score: quality,
        is_free_download: isFree,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Track credit purchase
  trackCreditPurchase(packageName: string, amount: number, currency: string) {
    this.trackEvent({
      action: 'purchase',
      category: 'ecommerce',
      label: packageName,
      value: amount,
      custom_parameters: {
        currency: currency,
        value: amount,
        items: [{
          item_id: packageName,
          item_name: packageName,
          price: amount,
          quantity: 1
        }]
      }
    });
  }

  // Track AI suggestions usage
  trackAISuggestions(genre: string, suggestionsUsed: number) {
    this.trackEvent({
      action: 'ai_suggestions_used',
      category: 'ai_features',
      label: genre,
      value: suggestionsUsed,
      custom_parameters: {
        genre: genre,
        suggestions_count: suggestionsUsed,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Track error
  trackError(errorType: string, errorMessage: string, page: string) {
    this.trackEvent({
      action: 'error',
      category: 'errors',
      label: errorType,
      custom_parameters: {
        error_type: errorType,
        error_message: errorMessage,
        page: page,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Track user engagement
  trackEngagement(action: string, duration?: number) {
    this.trackEvent({
      action: action,
      category: 'user_engagement',
      value: duration,
      custom_parameters: {
        engagement_duration: duration,
        user_type: this.userProperties.user_type,
        device_type: this.userProperties.device_type
      }
    });
  }

  // Track feature usage
  trackFeatureUsage(featureName: string, success: boolean) {
    this.trackEvent({
      action: 'feature_used',
      category: 'features',
      label: featureName,
      custom_parameters: {
        feature_name: featureName,
        success: success,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Track referral
  trackReferral(referralCode: string, referredBy: string) {
    this.trackEvent({
      action: 'referral',
      category: 'user_acquisition',
      label: referralCode,
      custom_parameters: {
        referral_code: referralCode,
        referred_by: referredBy,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Set user properties
  setUserProperties(properties: Partial<UserProperties>) {
    this.userProperties = { ...this.userProperties, ...properties };
    
    if (this.isInitialized) {
      window.gtag('config', 'G-TRACKING-ID', {
        custom_parameter_1: this.userProperties.user_type,
        custom_parameter_2: this.userProperties.genre_preference || 'none',
        custom_parameter_3: this.userProperties.mastering_credits || 0
      });
    }
  }

  // Track conversion funnel
  trackFunnelStep(step: string, stepNumber: number, totalSteps: number) {
    this.trackEvent({
      action: 'funnel_step',
      category: 'conversion',
      label: step,
      value: stepNumber,
      custom_parameters: {
        funnel_step: step,
        step_number: stepNumber,
        total_steps: totalSteps,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number) {
    this.trackEvent({
      action: 'performance',
      category: 'technical',
      label: metric,
      value: value,
      custom_parameters: {
        metric_name: metric,
        metric_value: value,
        device_type: this.userProperties.device_type
      }
    });
  }
}

export const analyticsService = new AnalyticsService();
