"use client";

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { WeatherAlerts } from '@/components/weather-alerts';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentScans } from '@/components/dashboard/recent-scans';
import { ScanHistory } from '@/components/dashboard/scan-history';
import { ScanAnalytics } from '@/components/dashboard/scan-analytics';



export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your plant health and track disease treatment progress.
        </p>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="plants">My Plants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-6 space-y-6">
          <DashboardStats />
          
          {/* Weather Alerts Section */}
          <WeatherAlerts />
          

          
          <RecentScans />
        </TabsContent>
        
        <TabsContent value="history" className="pt-6">
          <ScanHistory />
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-6">
          <ScanAnalytics />
        </TabsContent>
        
        <TabsContent value="plants" className="pt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Plant Management Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're working on a comprehensive plant management system where you can track your plants, 
                    set reminders, and monitor their health over time.
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p>✨ Track individual plants</p>
                  <p>📅 Set care reminders</p>
                  <p>📊 Monitor health trends</p>
                  <p>📝 Keep treatment notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}