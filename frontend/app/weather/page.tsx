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
  Info,
  Sun,
  Cloud,
  Wind,
  Eye,
  Shield
} from 'lucide-react';
import { WeatherService, WeatherAlert, WeatherData, WeatherAlertResponse } from '@/lib/api-service';
import { weatherNotifications } from '@/lib/weather-notifications';
import { useTranslations } from 'next-intl';

export default function WeatherPage() {
  const t = useTranslations('weather');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>(t('location'));
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherAlerts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: WeatherAlertResponse = await WeatherService.getCurrentLocationWeatherAlerts();
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
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather alerts');
      console.error('Weather alerts error:', err);
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
        return <Droplets className="h-5 w-5" />;
      case 'HIGH_TEMPERATURE':
        return <Thermometer className="h-5 w-5" />;
      case 'HIGH_PRECIPITATION':
        return <CloudRain className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
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
        return 'High Humidity';
      case 'HIGH_TEMPERATURE':
        return 'High Temperature';
      case 'HIGH_PRECIPITATION':
        return 'Heavy Rainfall';
      default:
        return type;
    }
  };

  const getWeatherIcon = (temperature: number, humidity: number, precipitation: number) => {
    if (precipitation > 5) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (humidity > 70) return <Cloud className="h-8 w-8 text-gray-500" />;
    if (temperature > 25) return <Sun className="h-8 w-8 text-yellow-500" />;
    return <Sun className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('currentWeather')}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchWeatherAlerts}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {t('refresh')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={fetchWeatherAlerts}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : weatherData ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{location}</span>
                  </div>
                  
                  {/* Location Details */}
                  {weatherData.location && (
                    <div className="mb-4 p-3 bg-muted/30 rounded-md">
                      <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                        {t('locationDetails')}
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
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
                  
                  <div className="text-center">
                    {getWeatherIcon(weatherData.temperature, weatherData.humidity, weatherData.precipitation)}
                    <div className="text-4xl font-bold mt-2">{weatherData.temperature}°C</div>
                    <p className="text-muted-foreground">Temperature</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-lg font-semibold">{weatherData.humidity}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CloudRain className="h-4 w-4 text-blue-500" />
                        <span className="text-lg font-semibold">{weatherData.precipitation}mm</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rainfall</p>
                    </div>
                  </div>

                  {lastUpdated && (
                    <div className="text-xs text-muted-foreground text-center pt-2">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Cloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Loading weather data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                {t('weatherAlerts')}
                {alerts.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {alerts.length} Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Weather Alerts</h3>
                  <p className="text-sm">Current weather conditions are safe for your plants.</p>
                  <p className="text-xs mt-2">We'll notify you when conditions change.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <Alert key={index} variant={getSeverityColor(alert.severity) as any}>
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTitle className="text-base">
                              {getAlertTypeLabel(alert.type)}
                            </AlertTitle>
                            <Badge variant={getSeverityColor(alert.severity) as any}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <AlertDescription className="text-sm mb-4">
                            {alert.message}
                          </AlertDescription>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Recommendations for your plants:
                            </p>
                            <ul className="space-y-2">
                              {alert.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} className="flex items-start gap-2 text-sm">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{rec}</span>
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
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('howWeatherAffects')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Thermometer className="h-8 w-8 mx-auto mb-3 text-orange-500" />
              <h4 className="font-medium mb-2">{t('temperature')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('temperatureDesc')}
              </p>
            </div>
            <div className="text-center">
              <Droplets className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h4 className="font-medium mb-2">{t('humidity')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('humidityDesc')}
              </p>
            </div>
            <div className="text-center">
              <CloudRain className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h4 className="font-medium mb-2">{t('rainfall')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('precipitationDesc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 