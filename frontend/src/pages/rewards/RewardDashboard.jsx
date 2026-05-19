import React from "react";
import { Gift, DollarSign, RefreshCw, Trophy, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { rewardService } from "@/services/reward.service";
import { customerService } from "@/services/customer.service";
import RewardChart from "@/components/rewards/RewardChart";
import DataTable from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/loaders/PageLoader";
import Badge from "@/components/ui/Badge";

export default function RewardDashboard() {
  const navigate = useNavigate();

  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["all-reward-history"],
    queryFn: () => rewardService.getHistory({ limit: 5 }),
  });

  const { data: customers, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["top-customers"],
    queryFn: () => customerService.getCustomers({ sort: "-total_points", limit: 5 }),
  });

  if (isHistoryLoading || isCustomersLoading) return <PageLoader />;

  const chartData = customers?.results?.map(c => ({
    name: c.full_name,
    points: c.total_points
  })) || [];

  const columns = [
    { header: "Customer", accessor: "customer_name" },
    { header: "Type", accessor: "transaction_type", cell: (row) => <Badge variant="secondary">{row.transaction_type}</Badge> },
    { header: "Amount", accessor: "amount", cell: (row) => (
      <span className={row.amount >= 0 ? "text-emerald-500 font-bold" : "text-destructive font-bold"}>
        {row.amount >= 0 ? "+" : ""}{row.amount}
      </span>
    )},
    { header: "Date", accessor: "created_at", cell: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Rewards Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track customer loyalty and point conversions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate("/rewards/history")}>
            <History size={18} /> View History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
            <Gift size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Points Issued</p>
            <p className="text-2xl font-bold">45,280</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Pending</p>
            <p className="text-2xl font-bold">$12,450</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <RefreshCw size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Conversions (Mo)</p>
            <p className="text-2xl font-bold">128</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Active Loyalty</p>
            <p className="text-2xl font-bold">85%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RewardChart data={chartData} />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border shadow-sm h-full flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold">Top Customers</h3>
              <Trophy size={18} className="text-amber-500" />
            </div>
            <div className="p-6 space-y-4">
              {customers?.results?.map((c, i) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}.</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{c.full_name}</span>
                      <span className="text-[10px] text-muted-foreground">{c.total_points} pts</span>
                    </div>
                  </div>
                  <Badge variant={i === 0 ? "success" : "secondary"}>
                    {i === 0 ? "ELITE" : "PRO"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="font-bold">Recent Reward Transactions</h3>
        </div>
        <div className="p-6">
          <DataTable 
            columns={columns} 
            data={history?.results || []} 
            isLoading={isHistoryLoading}
            emptyMessage="No transactions found"
          />
        </div>
      </div>
    </div>
  );
}
