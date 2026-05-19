import { Users, Gift, Tag, CalendarCheck, ArrowUpRight, Clock } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import ChartCard from "@/components/dashboard/ChartCard";
import DataTable from "@/components/tables/DataTable";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardHome() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Dummy recent activity data
  const recentActivityColumns = [
    { header: "Action", accessor: "action" },
    { header: "User", accessor: "user" },
    { header: "Time", accessor: "time" },
    { 
      header: "Status", 
      accessor: "status",
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
          {row.status}
        </span>
      )
    }
  ];

  const recentActivityData = [
    { id: 1, action: "New Customer Registered", user: "John Doe", time: "10 mins ago", status: "Success" },
    { id: 2, action: "Reward Redeemed", user: "Jane Smith", time: "1 hour ago", status: "Success" },
    { id: 3, action: "Attendance Marked", user: "Admin User", time: "2 hours ago", status: "Success" },
    { id: 4, action: "Offer Created", user: "System", time: "5 hours ago", status: "Success" },
  ];

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
          value="1,248" 
          icon={Users} 
          trend="up" 
          trendValue="12%" 
        />
        <StatsCard 
          title="Total Rewards" 
          value="342" 
          icon={Gift} 
          trend="up" 
          trendValue="8%" 
        />
        <StatsCard 
          title="Active Offers" 
          value="12" 
          icon={Tag} 
          trend="up" 
          trendValue="2%" 
        />
        <StatsCard 
          title="Today's Attendance" 
          value="45/48" 
          icon={CalendarCheck} 
          trend="down" 
          trendValue="1%" 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Revenue Overview" 
            description="Monthly revenue statistics and growth trends."
          />
        </div>
        <div className="lg:col-span-1">
          <ChartCard 
            title="Customer Demographics" 
            description="Breakdown of customer segments."
          />
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
            data={recentActivityData}
            emptyMessage="No recent activity"
            emptyDescription="There are no recorded actions yet."
          />
        </div>
      </div>
    </div>
  );
}
