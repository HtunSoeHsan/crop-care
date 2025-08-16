import { toast } from '@/hooks/use-toast';
import { WeatherAlert } from './api-service';

export class WeatherNotificationService {
  private static instance: WeatherNotificationService;
  private lastAlertIds: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): WeatherNotificationService {
    if (!WeatherNotificationService.instance) {
      WeatherNotificationService.instance = new WeatherNotificationService();
    }
    return WeatherNotificationService.instance;
  }

  /**
   * Show weather alerts as toast notifications
   */
  public showWeatherAlerts(alerts: WeatherAlert[], location?: string): void {
    alerts.forEach(alert => {
      const alertId = `${alert.type}-${alert.severity}`;

      // Only show new alerts to avoid spam
      if (!this.lastAlertIds.has(alertId)) {
        this.lastAlertIds.add(alertId);

        const locationText = location ? `\n📍 ${location}` : '';
        toast({
          title: this.getAlertTitle(alert),
          description: `${alert.message}${locationText}\n\nRecommendations:\n${alert.recommendations.slice(0, 2).map(rec => `• ${rec}`).join('\n')}`,
          variant: this.getToastVariant(alert.severity),
          duration: 10000, // 10 seconds
        });
      }
    });
  }

  /**
   * Clear old alerts when they're no longer active
   */
  public clearInactiveAlerts(currentAlerts: WeatherAlert[]): void {
    const currentAlertIds = new Set(
      currentAlerts.map(alert => `${alert.type}-${alert.severity}`)
    );

    // Remove alerts that are no longer active
    this.lastAlertIds.forEach(alertId => {
      if (!currentAlertIds.has(alertId)) {
        this.lastAlertIds.delete(alertId);
      }
    });
  }

  /**
   * Get appropriate toast title for the alert
   */
  private getAlertTitle(alert: WeatherAlert): string {
    const typeLabels = {
      'HIGH_HUMIDITY': '🌧️ High Humidity Alert',
      'HIGH_TEMPERATURE': '🌡️ High Temperature Alert',
      'HIGH_PRECIPITATION': '🌧️ Heavy Rainfall Alert',
    };

    return typeLabels[alert.type] || 'Weather Alert';
  }

  /**
   * Get appropriate toast variant for the alert severity
   */
  private getToastVariant(severity: string): 'default' | 'destructive' {
    return severity === 'danger' ? 'destructive' : 'default';
  }

  /**
   * Show a single weather alert
   */
  public showSingleAlert(alert: WeatherAlert, location?: string): void {
    const locationText = location ? `\n📍 ${location}` : '';
    toast({
      title: this.getAlertTitle(alert),
      description: `${alert.message}${locationText}`,
      variant: this.getToastVariant(alert.severity),
      duration: 8000,
    });
  }

  /**
   * Clear all stored alert IDs
   */
  public clearAllAlerts(): void {
    this.lastAlertIds.clear();
  }
}

export const weatherNotifications = WeatherNotificationService.getInstance(); 