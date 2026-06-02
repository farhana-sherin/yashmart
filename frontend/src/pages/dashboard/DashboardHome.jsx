import React from "react";
import { Users, Gift, Tag, CalendarCheck, ArrowUpRight, Clock, Briefcase, UserCheck, UserMinus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { offerService } from "@/services/offer.service";
import StatsCard from "@/components/dashboard/StatsCard";
import ChartCard from "@/components/dashboard/ChartCard";
import DataTable from "@/components/tables/DataTable";
import PageLoader from "@/components/loaders/PageLoader";
import Badge from "@/components/ui/Badge";
import { useAuthStore } from "@/store/auth.store";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardHome() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";
  const isCustomer = user?.role === "CUSTOMER";

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats-full"],
    queryFn: dashboardService.getStats,
    enabled: !isCustomer,
  });

  const { data: graphsDataResponse, isLoading: graphsLoading } = useQuery({
    queryKey: ["dashboard-graphs"],
    queryFn: dashboardService.getGraphs,
    enabled: !isCustomer,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["dashboard-recent-activities"],
    queryFn: dashboardService.getRecentActivities,
    enabled: !isCustomer,
  });

  const { data: customerOffersResponse, isLoading: customerOffersLoading } = useQuery({
    queryKey: ["customer-active-offers"],
    queryFn: () => offerService.getOffers({ is_active: true }),
    enabled: isCustomer,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const recentActivityColumns = [
    { header: "Action", accessor: "action" },
    { header: "User", accessor: "user" },
    { header: "Time", accessor: "time" },
    { 
      header: "Status", 
      accessor: "status",
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
          {row.status || "Success"}
        </span>
      )
    }
  ];

  if (isCustomer) {
    if (customerOffersLoading) return <PageLoader />;
  } else {
    if (statsLoading || activityLoading || graphsLoading) return <PageLoader />;
  }

  if (isCustomer) {
    const customerProfile = user?.customer_profile || {};
    const activeOffers = customerOffersResponse?.data?.results || [];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Welcome Section */}
        <div className="flex flex-col gap-1 md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {user?.name || "Valued Customer"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back to YasMart! Here is your loyalty and rewards summary.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border shadow-sm">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Loyalty Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">Loyalty Account ID</span>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users size={20} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-wider font-mono text-primary mt-4">
                {customerProfile.loyalty_id || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Show this ID/barcode at the checkout counter</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">Reward Points Balance</span>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Gift size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-500 mt-4">
                {customerProfile.total_points || 0} <span className="text-sm font-normal text-muted-foreground">pts</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Convertible to direct cashback discounts</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">Pending Balance Wallet</span>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Tag size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500 mt-4">
                ₹{customerProfile.pending_balance?.toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Accumulated from purchases and pending conversion</p>
            </div>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Active Promotions & Offers</h2>
            <p className="text-muted-foreground text-sm">Grab these store-wide deals on your next visit.</p>
          </div>

          {activeOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOffers.map((offer) => (
                <div key={offer.id} className="group bg-card border rounded-xl overflow-hidden hover:border-primary transition-all flex flex-col shadow-sm">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {offer.banner ? (
                      <img src={offer.banner} alt={offer.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Tag size={40} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg line-clamp-1">{offer.title}</h3>
                      {offer.discount_percentage ? (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">-{offer.discount_percentage}%</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">Promo</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                    
                    <div className="pt-4 mt-auto border-t flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={14} />
                        <span>Valid until {new Date(offer.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border rounded-xl p-12 text-center flex flex-col items-center justify-center">
              <Tag className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-semibold text-lg">No active offers right now</h3>
              <p className="text-sm text-muted-foreground">Check back soon for new discounts and promotions.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const stats = statsData?.data || {};
  const graphs = graphsDataResponse?.data || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1 md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {user?.name || "User"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your supermarket's performance today.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border shadow-sm">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Customers" 
          value={stats.customers?.total_customers || 0} 
          icon={Users} 
        />
        <StatsCard 
          title="Total Rewards" 
          value={stats.rewards?.total_transactions || 0} 
          icon={Gift} 
        />
        <StatsCard 
          title="Active Offers" 
          value={stats.offers?.active_offers || 0} 
          icon={Tag} 
        />
        <StatsCard 
          title="Today's Attendance" 
          value={stats.attendance?.todays_attendance || "0/0"} 
          icon={CalendarCheck} 
        />
      </div>

      {/* Admin Specific Staff Section */}
      {isAdmin && stats.staff && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Staff Overview Today</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Staff" 
              value={stats.staff.total_staff || 0} 
              icon={Briefcase} 
            />
            <StatsCard 
              title="Active Staff" 
              value={stats.staff.active_staff || 0} 
              icon={Users} 
            />
            <StatsCard 
              title="Present Today" 
              value={stats.staff.present_today || 0} 
              icon={UserCheck} 
              className="border-emerald-500/20"
            />
            <StatsCard 
              title="Absent Today" 
              value={stats.staff.absent_today || 0} 
              icon={UserMinus} 
              className="border-rose-500/20"
            />
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Customer Growth" 
            description="Monthly customer acquisition trends."
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={graphs.customer_growth || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="lg:col-span-1">
          <ChartCard 
            title="Attendance Trend" 
            description="Daily staff attendance (Last 30 days)."
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphs.attendance_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-card rounded-xl border shadow-sm flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-1">Latest actions performed in the system.</p>
          </div>
          <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <DataTable 
            columns={recentActivityColumns} 
            data={recentActivity?.data || []}
            emptyMessage="No recent activity"
            emptyDescription="There are no recorded actions yet."
          />
        </div>
      </div>
    </div>
  );
}
