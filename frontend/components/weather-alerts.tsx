"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  CloudRain,
  RefreshCw,
  MapPin,
  Info
} from 'lucide-react';
import { WeatherService, WeatherAlert, WeatherData, WeatherAlertResponse, ApiService } from '@/lib/api-service';
import { weatherNotifications } from '@/lib/weather-notifications';
import { useTranslations } from 'next-intl';

interface WeatherAlertsProps {
  className?: string;
}

export function WeatherAlerts({ className }: WeatherAlertsProps) {
  const t = useTranslations('weather');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>(t('location'));

  const fetchWeatherAlerts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is authenticated
      // const token = ApiService.getAuthToken();
      // console.log('Auth token:', token ? 'Present' : 'Missing');
      
      // if (!token) {
      //   setError('Please log in to view weather alerts');
      //   setLoading(false);
      //   return;
      // }

      console.log('Fetching weather alerts...');
      const response: WeatherAlertResponse = await WeatherService.getCurrentLocationWeatherAlerts();
      console.log('Weather response:', response);
      
      setWeatherData(response.data.weather);
      
      // Show notifications for new alerts
      const locationText = response.data.weather.location 
        ? `${response.data.weather.location.name}, ${response.data.weather.location.country}`
        : undefined;
      weatherNotifications.showWeatherAlerts(response.data.alerts, locationText);
      weatherNotifications.clearInactiveAlerts(response.data.alerts);
      
      setAlerts(response.data.alerts);
      // Use backend location data if available, otherwise use generic location
      if (response.data.weather.location) {
        setLocation(`${response.data.weather.location.name}, ${response.data.weather.location.country}`);
      } else {
        setLocation(t('location'));
      }
    } catch (err) {
      console.error('Weather alerts error:', err);
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          setError(t('errors.unauthorized'));
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          setError(t('errors.accessDenied'));
        } else if (err.message.includes('Failed to fetch')) {
          setError(t('errors.connectionError'));
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to fetch weather alerts');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'HIGH_HUMIDITY':
        return <Droplets className="h-4 w-4" />;
      case 'HIGH_TEMPERATURE':
        return <Thermometer className="h-4 w-4" />;
      case 'HIGH_PRECIPITATION':
        return <CloudRain className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'HIGH_HUMIDITY':
        return t('alerts.highHumidity');
      case 'HIGH_TEMPERATURE':
        return t('alerts.highTemperature');
      case 'HIGH_PRECIPITATION':
        return t('alerts.heavyRainfall');
      default:
        return type;
    }
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t('weatherAlerts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              {error.includes('log in') ? (
                <div className="mt-3">
                  <p className="text-sm mb-2">{t('errors.authRequiredDesc')}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mr-2"
                    onClick={() => window.location.href = '/login'}
                  >
                    {t('errors.logIn')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={fetchWeatherAlerts}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('retry')}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={fetchWeatherAlerts}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('retry')}
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t('weatherAlerts')}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Test with fixed coordinates (London)
                WeatherService.getWeatherAlerts(51.5074, -0.1278)
                  .then(response => {
                    console.log('Test API call successful:', response);
                    setWeatherData(response.data.weather);
                    setAlerts(response.data.alerts);
                    // Use backend location data if available
                    if (response.data.weather.location) {
                      setLocation(`${response.data.weather.location.name}, ${response.data.weather.location.country}`);
                    } else {
                      setLocation(t('testLocation'));
                    }
                  })
                  .catch(err => {
                    console.error('Test API call failed:', err);
                    setError(`Test failed: ${err.message}`);
                  });
              }}
              className="text-xs"
            >
              {t('testApi')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchWeatherAlerts}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('refresh')}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        {weatherData && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{location}</span>
            </div>
            
            {/* Location Details */}
            {weatherData.location && (
              <div className="mb-4 p-3 bg-background rounded-md border">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  {t('locationDetails')}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">{t('city')}: </span>
                    <span className="font-medium">{weatherData.location.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('region')}: </span>
                    <span className="font-medium">{weatherData.location.region}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('country')}: </span>
                    <span className="font-medium">{weatherData.location.country}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('localTime')}: </span>
                    <span className="font-medium">
                      {new Date(weatherData.location.localtime).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
                <div className="text-xs text-muted-foreground">{t('temperature')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{weatherData.humidity}%</div>
                <div className="text-xs text-muted-foreground">{t('humidity')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{weatherData.precipitation}mm</div>
                <div className="text-xs text-muted-foreground">{t('rainfall')}</div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Alerts */}
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>{t('noAlerts')}</p>
            <p className="text-sm">{t('noAlertsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              {t('activeAlerts')} ({alerts.length})
            </h4>
            {alerts.map((alert, index) => (
              <Alert key={index} variant={getSeverityColor(alert.severity) as any}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTitle className="text-sm">
                        {getAlertTypeLabel(alert.type)}
                      </AlertTitle>
                      <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm mb-3">
                      {alert.message}
                    </AlertDescription>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">{t('recommendationsForPlants')}</p>
                      <ul className="text-xs space-y-1">
                        {alert.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 