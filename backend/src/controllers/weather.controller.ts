import { Request, Response } from 'express';
import axios from 'axios';
interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
}

const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  // Replace with your preferred weather API
  const response = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`
  );

  console.log("weather data", response.data);
  return {
    temperature: response.data.current.temp_c,
    humidity: response.data.current.humidity,
    precipitation: response.data.current.precip_mm,
    location: {
      name: response.data.location.name,
      region: response.data.location.region,
      country: response.data.location.country,
      lat: response.data.location.lat,
      lon: response.data.location.lon,
      localtime: response.data.location.localtime
    }
  };
};

const generateDiseaseAlerts = (weatherData: WeatherData) => {
  const alerts = [];

  // High humidity alert (fungal diseases)
  if (weatherData.humidity > 80) {
    alerts.push({
      type: 'HIGH_HUMIDITY',
      severity: 'warning',
      message: 'High humidity conditions detected. Increased risk of fungal diseases.',
      recommendations: [
        'Ensure proper air circulation around plants',
        'Avoid overhead watering',
        'Consider applying preventive fungicide'
      ]
    });
  }

  // High temperature alert
  if (weatherData.temperature > 30) {
    alerts.push({
      type: 'HIGH_TEMPERATURE',
      severity: 'warning',
      message: 'High temperature conditions detected. Plants may be stressed.',
      recommendations: [
        'Increase watering frequency',
        'Provide shade if possible',
        'Monitor for heat stress symptoms'
      ]
    });
  }

  // High precipitation alert
  if (weatherData.precipitation > 10) {
    alerts.push({
      type: 'HIGH_PRECIPITATION',
      severity: 'warning',
      message: 'Heavy rainfall detected. Risk of water-borne diseases.',
      recommendations: [
        'Ensure proper drainage',
        'Monitor for water-logging',
        'Check for signs of root rot'
      ]
    });
  }

  return alerts;
};

export const getWeatherAlerts = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        status: 'error',
        message: 'Latitude and longitude are required'
      });
    }

    const weatherData = await getWeatherData(
      Number(latitude),
      Number(longitude)
    );

    const alerts = generateDiseaseAlerts(weatherData);

    res.json({
      status: 'success',
      data: {
        weather: weatherData,
        alerts
      }
    });
  } catch (error) {
    console.error('Weather alert error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching weather alerts'
    });
  }
}; 