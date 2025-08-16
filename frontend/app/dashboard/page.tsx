"use client";

import { useState } from 'react';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { WeatherAlerts } from '@/components/weather-alerts';

// Mock data
const scanHistory = [
  {
    id: 1,
    date: "2023-05-15",
    plant: "Tomato",
    disease: "Early Blight",
    confidence: 0.92,
    status: "Treated",
    image: "https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    date: "2023-05-20",
    plant: "Rose",
    disease: "Black Spot",
    confidence: 0.85,
    status: "Treating",
    image: "https://images.pexels.com/photos/539431/pexels-photo-539431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    date: "2023-06-02",
    plant: "Cucumber",
    disease: "Powdery Mildew",
    confidence: 0.78,
    status: "Monitoring",
    image: "https://images.pexels.com/photos/7228341/pexels-photo-7228341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 4,
    date: "2023-06-15",
    plant: "Apple Tree",
    disease: "Fire Blight",
    confidence: 0.89,
    status: "Treated",
    image: "https://images.pexels.com/photos/7342247/pexels-photo-7342247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const monthlyScans = [
  { name: 'Jan', scans: 4 },
  { name: 'Feb', scans: 6 },
  { name: 'Mar', scans: 8 },
  { name: 'Apr', scans: 10 },
  { name: 'May', scans: 12 },
  { name: 'Jun', scans: 8 },
  { name: 'Jul', scans: 10 },
  { name: 'Aug', scans: 0 },
  { name: 'Sep', scans: 0 },
  { name: 'Oct', scans: 0 },
  { name: 'Nov', scans: 0 },
  { name: 'Dec', scans: 0 },
];

const diseaseDistribution = [
  { name: 'Fungal', value: 65 },
  { name: 'Bacterial', value: 20 },
  { name: 'Viral', value: 10 },
  { name: 'Pest', value: 5 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const treatmentSuccess = [
  { name: 'Jan', success: 78 },
  { name: 'Feb', success: 82 },
  { name: 'Mar', success: 85 },
  { name: 'Apr', success: 80 },
  { name: 'May', success: 88 },
  { name: 'Jun', success: 92 },
  { name: 'Jul', success: 90 },
];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
                <CardDescription className="text-3xl font-bold">48</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Treatments</CardTitle>
                <CardDescription className="text-3xl font-bold">3</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">2 completing this week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                <CardDescription className="text-3xl font-bold">87%</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Based on treated plants</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Weather Alerts Section */}
          <WeatherAlerts />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Scans</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyScans}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="scans" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Disease Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diseaseDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {diseaseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {scanHistory.slice(0, 4).map((scan) => (
                  <Card key={scan.id}>
                    <div className="relative h-40">
                      <Image 
                        src={scan.image} 
                        alt={scan.plant}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="font-semibold">{scan.plant}</p>
                      <p className="text-sm text-muted-foreground">{scan.disease}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs">{scan.date}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          scan.status === 'Treated' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          scan.status === 'Treating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {scan.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="pt-6 space-y-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Scan History</h2>
            <Button>Export History</Button>
          </div>
          
          <div className="space-y-4">
            {scanHistory.map((scan) => (
              <Card key={scan.id}>
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-40 md:h-auto">
                    <Image 
                      src={scan.image} 
                      alt={scan.plant}
                      fill
                      className="object-cover md:rounded-l-lg"
                    />
                  </div>
                  <CardContent className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{scan.plant}</h3>
                        <p className="text-muted-foreground">{scan.disease}</p>
                      </div>
                      <div className="text-right mt-2 md:mt-0">
                        <p className="text-sm">{scan.date}</p>
                        <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                          scan.status === 'Treated' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          scan.status === 'Treating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {scan.status}
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Confidence</p>
                        <p className="text-sm">{(scan.confidence * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Treatment Started</p>
                        <p className="text-sm">{scan.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Next Check</p>
                        <p className="text-sm">In 3 days</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Update Status</Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={treatmentSuccess}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="success" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Disease Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diseaseDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {diseaseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyScans}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="scans" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="plants" className="pt-6 space-y-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">My Plants</h2>
            <Button>Add New Plant</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Tomato Plant",
                variety: "Roma",
                health: "Good",
                image: "https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                lastScanned: "3 days ago",
                issues: 1
              },
              {
                name: "Rose Bush",
                variety: "Hybrid Tea",
                health: "Treating",
                image: "https://images.pexels.com/photos/539431/pexels-photo-539431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                lastScanned: "1 week ago",
                issues: 1
              },
              {
                name: "Cucumber",
                variety: "English",
                health: "Excellent",
                image: "https://images.pexels.com/photos/7228341/pexels-photo-7228341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                lastScanned: "2 weeks ago",
                issues: 0
              },
              {
                name: "Apple Tree",
                variety: "Gala",
                health: "Good",
                image: "https://images.pexels.com/photos/7342247/pexels-photo-7342247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                lastScanned: "1 month ago",
                issues: 0
              },
              {
                name: "Basil",
                variety: "Sweet",
                health: "Excellent",
                image: "https://images.pexels.com/photos/4505174/pexels-photo-4505174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                lastScanned: "2 days ago",
                issues: 0
              },
              {
                name: "Strawberry",
                variety: "Alpine",
                health: "Monitoring",
                image: "https://images.pexels.com/photos/4917093/pexels-photo-4917093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                lastScanned: "5 days ago",
                issues: 1
              }
            ].map((plant, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40">
                  <Image 
                    src={plant.image} 
                    alt={plant.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm ${
                      plant.health === 'Excellent' ? 'text-green-600' :
                      plant.health === 'Good' ? 'text-blue-600' :
                      plant.health === 'Treating' ? 'text-yellow-600' :
                      'text-orange-600'
                    }`}>
                      {plant.health}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{plant.name}</h3>
                  <p className="text-sm text-muted-foreground">{plant.variety}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Last Scanned</p>
                      <p>{plant.lastScanned}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Issues</p>
                      <p>{plant.issues}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}