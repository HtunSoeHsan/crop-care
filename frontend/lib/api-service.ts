/**
 * API service for interacting with the backend Flask API
 */

import { isPlantHealthy } from "./utils";

// Define the base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

// Multilingual text interface
export interface MultilingualText {
  en: string;
  my: string;
}

// Medicine interface
export interface Medicine {
  name: MultilingualText;
  active_ingredient: MultilingualText;
  application: MultilingualText;
  frequency: MultilingualText;
  precautions: MultilingualText;
  waiting_period: MultilingualText;
  expiry: MultilingualText;
  avoid: MultilingualText;
  image: string;
}

// Disease treatment interface
export interface DiseaseTreatment {
  name: MultilingualText;
  description: MultilingualText;
  steps: MultilingualText[];
}

// Disease detection interface
export interface DiseaseDetection {
  confidence: string; // e.g. 0.92 for 92%
  imageUrl?: string;  // Optional image used for detection
  detectedAt?: Date;  // Optional timestamp of detection
}

// Plant disease interface
export interface PlantDisease {
  classIndex: number;
  name: MultilingualText;
  description: MultilingualText;
  symptoms: MultilingualText[];
  plantType: MultilingualText;
  treatments: DiseaseTreatment[];
  prevention?: MultilingualText[];
  recommendations?: MultilingualText[];
  detection?: DiseaseDetection;
  preventionTips?: MultilingualText[];
}

// Plant care guide interface
export interface PlantCareGuide {
  plantName: MultilingualText;
  scientificName?: string;
  plantType: MultilingualText;
  description: MultilingualText;
  images: string[];
  careInstructions: {
    watering: {
      frequency: MultilingualText;
      amount: MultilingualText;
      tips: MultilingualText[];
    };
    sunlight: {
      requirement: MultilingualText;
      hours: MultilingualText;
      tips: MultilingualText[];
    };
    soil: {
      type: MultilingualText;
      pH?: string;
      drainage: MultilingualText;
      tips: MultilingualText[];
    };
    fertilizing: {
      frequency: MultilingualText;
      type: MultilingualText;
      tips: MultilingualText[];
    };
  };
}

// Plant disease scan result interface (legacy - keeping for backward compatibility)
export interface DiseaseResult {
  status: 'healthy' | 'diseased';
  disease?: {
    name: MultilingualText;
    scientific_name: MultilingualText;
    description: MultilingualText;
    cause: MultilingualText;
    treatment: {
      organic: MultilingualText[];
      conventional: MultilingualText[];
    };
    prevention: MultilingualText[];
    severity: MultilingualText;
    spread_rate: MultilingualText;
    symptoms: MultilingualText[];
    medicine?: {
      organic: Medicine[];
      conventional: Medicine[];
    };
  };
  confidence: number;
  message?: MultilingualText;
  timestamp: string;
  filename: string;
}

// New interface for the actual API response format
export interface ScanDetectionResult {
  classIndex: number;
  name: MultilingualText;
  description: MultilingualText;
  symptoms: MultilingualText[];
  plantType: MultilingualText;
  treatments: DiseaseTreatment[];
  recommendations?: MultilingualText[];
  detection: DiseaseDetection;
}

// Updated scan result interface
export interface ScanResult {
  detections: ScanDetectionResult[];
  primaryDetection?: ScanDetectionResult;
  isHealthy: boolean;
  confidence: number;
  imageUrl?: string;
}

// Chatbot interfaces
export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  relatedInfo?: {
    type: 'disease' | 'treatment' | 'prevention' | 'care';
    title: string;
    description: string;
  };
}

export interface ChatRequest {
  message: string;
  context?: {
    scanResults?: ScanDetectionResult;
    plantType?: string;
    location?: string;
    weather?: any;
  };
  sessionId?: string;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    answer: string;
    sources: string[];
    confidence: number;
    suggestions?: string[];
    relatedInfo?: {
      type: 'disease' | 'treatment' | 'prevention' | 'care';
      title: string;
      description: string;
    };
  };
  error?: string;
}

export interface ChatbotHealth {
  status: string;
  message: string;
  details?: {
    model: string;
    vectorStoreSize: number;
    conversationHistorySize: number;
  };
}

// Weather alert interfaces
export interface WeatherData {
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

export interface WeatherAlert {
  type: 'HIGH_HUMIDITY' | 'HIGH_TEMPERATURE' | 'HIGH_PRECIPITATION';
  severity: 'warning' | 'danger' | 'info';
  message: string;
  recommendations: string[];
}

export interface WeatherAlertResponse {
  status: string;
  data: {
    weather: WeatherData;
    alerts: WeatherAlert[];
  };
}

// Search interfaces
export interface SearchResult {
  diseases: any[];
  plantGuides: any[];
  healthyFoods: any[];
  totalResults: number;
}

export interface SearchFilters {
  category?: string;
  type?: string;
  language?: string;
  severity?: string;
  plantType?: string;
  tags?: string;
  season?: string;
  nutrients?: string;
}

export interface SearchResponse {
  status: string;
  data: SearchResult;
  query: string;
  filters: SearchFilters;
}

export interface SuggestionsResponse {
  status: string;
  data: {
    suggestions: string[];
  };
}

// Scan history interfaces
export interface ScanHistoryItem {
  _id: string;
  userId: string;
  classIndex: number;
  confidence: string;
  isHealthy: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  diseaseInfo: {
    name: MultilingualText;
    description: MultilingualText;
    symptoms: MultilingualText[];
    affectedCrops: MultilingualText;
    treatments: Array<{
      name: MultilingualText;
      description: MultilingualText;
      steps: MultilingualText[];
    }>;
    recommendations: MultilingualText[];
    severity: string;
    classIndex: number;
  };
}

export interface ScanHistoryResponse {
  status: string;
  data: {
    scans: ScanHistoryItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Service for handling API requests
export const ApiService = {
  /**
   * Upload an image for plant disease detection
   * @param imageFile - The image file to upload
   * @returns Promise with the disease detection results
   */
  async scanPlant(imageFile: File): Promise<ScanResult> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${API_URL}/detections/detect`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication    
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log("scanPlant error response", errorData);
        throw new Error(errorData.error || 'Failed to scan plant');
      }
      
      const data = await response.json();
      
      // Process the array of detections - handle both direct array and nested data structure
      let detections: ScanDetectionResult[] = [];
      
      if (Array.isArray(data)) {
        // Direct array response
        detections = data;
      } else if (data.data && Array.isArray(data.data)) {
        // Nested data structure
        detections = data.data;
      } else {
        // Fallback to empty array
        detections = [];
      }
      
      if (!detections || detections.length === 0) {
        return {
          detections: [],
          isHealthy: true,
          confidence: 0
        };
      }
      
      // Sort by confidence (highest first)
      const sortedDetections = detections.sort((a, b) => 
        parseFloat(b.detection.confidence) - parseFloat(a.detection.confidence)
      );
      
      const primaryDetection = sortedDetections[0];
      const confidence = parseFloat(primaryDetection.detection.confidence);
      
      // Determine if plant is healthy based on the primary detection
      const isHealthy = isPlantHealthy({name: primaryDetection.name});
      
      return {
        detections: sortedDetections,
        primaryDetection,
        isHealthy,
        confidence
      };
    } catch (error) {
      console.error('Error scanning plant:', error);
      throw error;
    }
  },

  /**
   * Get the list of diseases from the database
   * @returns Promise with the disease database
   */
  async getDiseases(): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${API_URL}/diseases`);

      if (!response.ok) {
        throw new Error('Failed to fetch diseases database');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching diseases:', error);
      throw error;
    }
  },

  /**
   * Get plant care guides
   * @returns Promise with the plant care guides
   */
  async getPlantCareGuides(): Promise<PlantCareGuide[]> {
    try {
      const response = await fetch(`${API_URL}/plant-care-guides`);

      if (!response.ok) {
        throw new Error('Failed to fetch plant care guides');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching plant care guides:', error);
      throw error;
    }
  },

  /**
   * Get a specific plant care guide by ID
   * @param id - The ID of the plant care guide
   * @returns Promise with the plant care guide
   */
  async getPlantCareGuide(id: string): Promise<PlantCareGuide> {
    try {
      const response = await fetch(`${API_URL}/plant-care-guides/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch plant care guide');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching plant care guide:', error);
      throw error;
    }
  },

  /**
   * Check if the API is available
   * @returns Promise with the health check status
   */
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_URL}/health`);

      if (!response.ok) {
        throw new Error('API health check failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API health check error:', error);
      throw error;
    }
  },

  // Chatbot API methods
  /**
   * Send a message to the chatbot and get a response
   * @param request - The chat request with message and context
   * @returns Promise with the chatbot response
   */
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to send chat message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },

  /**
   * Get conversation history (requires authentication)
   * @returns Promise with the conversation history
   */
  async getConversationHistory(): Promise<{ messages: ChatMessage[]; totalMessages: number }> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_URL}/chatbot/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get conversation history');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  },

  /**
   * Clear conversation history (requires authentication)
   * @returns Promise with the result
   */
  async clearConversationHistory(): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_URL}/chatbot/history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear conversation history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      throw error;
    }
  },

  /**
   * Get chatbot health status
   * @returns Promise with the chatbot health information
   */
  async getChatbotHealth(): Promise<ChatbotHealth> {
    try {
      const response = await fetch(`${API_URL}/chatbot/health`);

      if (!response.ok) {
        throw new Error('Failed to get chatbot health');
      }

      const result = await response.json();
      console.log("check chatbot health result", result);
      return result.data;
    } catch (error) {
      console.error('Error getting chatbot health:', error);
      throw error;
    }
  },

  /**
   * Add new knowledge to the chatbot (requires authentication)
   * @param knowledge - The knowledge to add
   * @returns Promise with the result
   */
  async addChatbotKnowledge(knowledge: any): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_URL}/chatbot/knowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(knowledge),
      });

      if (!response.ok) {
        throw new Error('Failed to add knowledge');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding knowledge:', error);
      throw error;
    }
  },

  /**
   * Get authentication token from cookies or localStorage
   * @returns The authentication token
   */
  getAuthToken(): string {
    // Try to get token from cookies first
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    console.log("getAuthToken", tokenCookie);
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }

    // Fallback to localStorage
    return localStorage.getItem('authToken') || '';
  },

  async getScanHistory(page: number = 1, limit: number = 10): Promise<ScanHistoryResponse> {
    try {
      const response = await fetch(`${API_URL}/scan-history?page=${page}&limit=${limit}`, {
                  credentials: 'include',

      });

      if (!response.ok) {
        throw new Error('Failed to fetch scan history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching scan history:', error);
      throw error;
    }
  },

  /**
   * Save scan result to history
   */
  async saveScanResult(results: any[], imageUrl: string): Promise<{ success: boolean; message: string; scanId: string }> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_URL}/scan-history/save`, {
        method: 'POST',
          credentials: 'include', // 👈 required to send cookies back
        headers: {
    'Content-Type': 'application/json',
  },
        body: JSON.stringify({ results }),
      });

      if (!response.ok) {
        throw new Error('Failed to save scan result');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving scan result:', error);
      throw error;
    }
  },

  /**
   * Delete a scan from history
   */
  async deleteScanHistory(scanId: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_URL}/scan-history/${scanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete scan history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting scan history:', error);
      throw error;
    }
  }
};

// Search API methods
export const SearchService = {
  /**
   * Search across all content types
   */
  async searchAll(query: string, filters: SearchFilters = {}): Promise<SearchResponse> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await fetch(`${API_URL}/search/all?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to perform search');
      }

      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  /**
   * Search diseases specifically
   */
  async searchDiseases(query: string, filters: SearchFilters = {}): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await fetch(`${API_URL}/search/diseases?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search diseases');
      }

      return await response.json();
    } catch (error) {
      console.error('Disease search error:', error);
      throw error;
    }
  },

  /**
   * Search plant care guides
   */
  async searchPlantGuides(query: string, filters: SearchFilters = {}): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await fetch(`${API_URL}/search/plant-guides?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search plant guides');
      }

      return await response.json();
    } catch (error) {
      console.error('Plant guide search error:', error);
      throw error;
    }
  },

  /**
   * Search healthy foods
   */
  async searchHealthyFoods(query: string, filters: SearchFilters = {}): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await fetch(`${API_URL}/search/healthy-foods?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search healthy foods');
      }

      return await response.json();
    } catch (error) {
      console.error('Healthy food search error:', error);
      throw error;
    }
  },

  /**
   * Get search suggestions for autocomplete
   */
  async getSearchSuggestions(query: string, type?: string): Promise<SuggestionsResponse> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`${API_URL}/search/suggestions?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to get search suggestions');
      }

      return await response.json();
    } catch (error) {
      console.error('Search suggestions error:', error);
      throw error;
    }
  }
};

// Weather API methods
export const WeatherService = {
  /**
   * Get weather alerts for a specific location
   */
  async getWeatherAlerts(latitude: number, longitude: number): Promise<WeatherAlertResponse> {
    try {
      // const token = ApiService.getAuthToken();
      // if (!token) {
      //   throw new Error('Authentication required. Please log in.');
      // }

      const response = await fetch(`${API_URL}/weather/alerts?latitude=${latitude}&longitude=${longitude}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Please check your permissions.');
        } else if (response.status === 400) {
          throw new Error('Invalid location data. Please check coordinates.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("weather alerts data", data);
      return data;
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather alerts');
    }
  },

  /**
   * Get user's current location and fetch weather alerts
   */
  async getCurrentLocationWeatherAlerts(): Promise<WeatherAlertResponse> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await this.getWeatherAlerts(latitude, longitude);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        }
      );
    });
  },
};

export default ApiService;