'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from 'next-intl';
import { useAnalytics } from '@/hooks/use-analytics';
import { getLocalizedProperty } from '@/lib/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

export function ScanAnalytics() {
  // Simple test data
  const testData = [
    { name: 'Jan', scans: 4 },
    { name: 'Feb', scans: 6 },
    { name: 'Mar', scans: 8 }
  ];
  
  const { data, loading, error } = useAnalytics();
  const locale = useLocale();
  
  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { en: string; my: string } } = {
      'Monthly Scans': { en: 'Monthly Scans', my: 'လစဉ် စကင်န်များ' },
      'Health Status Distribution': { en: 'Health Status Distribution', my: 'ကျန်းမာရေး အခြေအနေ ဖြန့်ဝေမှု' },
      'Confidence Level Distribution': { en: 'Confidence Level Distribution', my: 'ယုံကြည်မှု အဆင့် ဖြန့်ဝေမှု' },
      'Top Diseases': { en: 'Top Diseases', my: 'အများဆုံး ရောဂါများ' },
      'Healthy': { en: 'Healthy', my: 'ကျန်းမာ' },
      'Disease Detected': { en: 'Disease Detected', my: 'ရောဂါ တွေ့ရှိ' },
      'High (80-100%)': { en: 'High (80-100%)', my: 'မြင့် (80-100%)' },
      'Medium (60-79%)': { en: 'Medium (60-79%)', my: 'အလယ်အလတ် (60-79%)' },
      'Low (0-59%)': { en: 'Low (0-59%)', my: 'နိမ့် (0-59%)' }
    };
    return texts[key]?.[locale as 'en' | 'my'] || texts[key]?.en || key;
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load analytics: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  console.log('Analytics data:', data); // Debug log



  // Use real data from API
  const displayData = data;
  
  console.log('Display data:', displayData);
  console.log('Monthly data:', displayData.monthlyData);

  const monthlyChartData = {
    labels: data.monthlyData.map(item => item.name),
    datasets: [
      {
        label: 'Scans',
        data: data.monthlyData.map(item => item.scans),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
      },
    ],
  };

  const healthChartData = {
    labels: data.healthDistribution.map(item => getLocalizedText(item.name)),
    datasets: [
      {
        data: data.healthDistribution.map(item => item.value),
        backgroundColor: ['#3b82f6', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  const confidenceChartData = {
    labels: data.confidenceDistribution.map(item => getLocalizedText(item.name)),
    datasets: [
      {
        label: 'Count',
        data: data.confidenceDistribution.map(item => item.value),
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Scans Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{getLocalizedText('Monthly Scans')}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <Bar data={monthlyChartData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Health Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{getLocalizedText('Health Status Distribution')}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <Pie data={healthChartData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Confidence Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>{getLocalizedText('Confidence Level Distribution')}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <Bar 
            data={confidenceChartData} 
            options={{
              ...chartOptions,
              indexAxis: 'y' as const,
            }} 
          />
        </CardContent>
      </Card>

      {/* Top Diseases */}
      <Card>
        <CardHeader>
          <CardTitle>{getLocalizedText('Top Diseases')}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {data.topDiseases && data.topDiseases.length > 0 ? (
            <div className="space-y-4">
              {data.topDiseases.map((disease, index) => (
                <div key={disease.classIndex} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{getLocalizedProperty(disease.name, locale)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{disease.count} cases</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No disease data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}