import React from "react";
import { 
  TrendingUp, 
  Users, 
  Gift, 
  Tag, 
  ArrowUpRight, 
  ArrowDownRight,
  Download
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { analyticsService } from "@/services/analytics.service";
import StatsCard from "@/components/dashboard/StatsCard";
import ChartCard from "@/components/dashboard/ChartCard";
import PageLoader from "@/components/loaders/PageLoader";
import DataTable from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";

export default function AdvancedAnalytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["advanced-analytics"],
    queryFn: analyticsService.getDashboardStats,
  });

  if (isLoading) return <PageLoader />;

  // Dummy data for visualization
  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 4500 },
    { name: "May", revenue: 6000 },
    { name: "Jun", revenue: 5500 },
  ];

  const offerPerformanceData = [
    { name: "Summer Sale", value: 400 },
    { name: "Back to School", value: 300 },
    { name: "Flash Friday", value: 500 },
    { name: "New Year", value: 200 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep-dive into business performance and customer metrics.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={18} /> Export Report
        </Button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Gross Revenue" 
          value="$124,580" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="18.2%" 
        />
        <StatsCard 
          title="Customer Retention" 
          value="74.5%" 
          icon={Users} 
          trend="up" 
          trendValue="4.1%" 
        />
        <StatsCard 
          title="Points Redemption" 
          value="42,300" 
          icon={Gift} 
          trend="down" 
          trendValue="2.5%" 
        />
        <StatsCard 
          title="Offer Conversion" 
          value="12.4%" 
          icon={Tag} 
          trend="up" 
          trendValue="3.8%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Growth" description="Monthly gross revenue trends for the current year.">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Offer Performance Bar Chart */}
        <div className="lg:col-span-1">
          <ChartCard title="Offer Performance" description="Redemption counts by promotional campaign.">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={offerPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} dy={5} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={30}>
                  {offerPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers Table */}
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold">Top Performing Customers</h3>
            <span className="text-xs text-muted-foreground uppercase font-semibold">By Reward Points</span>
          </div>
          <div className="p-6">
            <DataTable 
              columns={[
                { header: "Customer", accessor: "full_name" },
                { header: "Points", accessor: "total_points" },
                { header: "Purchases", accessor: "purchases", cell: () => "12" }
              ]} 
              data={[]} 
              emptyMessage="Loading top performers..."
            />
          </div>
        </div>

        {/* Top Staff Table */}
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold">Top Performing Staff</h3>
            <span className="text-xs text-muted-foreground uppercase font-semibold">By Attendance Rate</span>
          </div>
          <div className="p-6">
            <DataTable 
              columns={[
                { header: "Staff Member", accessor: "name" },
                { header: "Rate", accessor: "attendance_rate", cell: () => "98%" },
                { header: "Check-ins", accessor: "checkins", cell: () => "22" }
              ]} 
              data={[]} 
              emptyMessage="Loading top performers..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
