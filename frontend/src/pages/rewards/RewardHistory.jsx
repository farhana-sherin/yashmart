import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, History } from "lucide-react";
import { rewardService } from "@/services/reward.service";
import DataTable from "@/components/tables/DataTable";
import Badge from "@/components/ui/Badge";
import { Input } from "@/components/ui/input";
import PageLoader from "@/components/loaders/PageLoader";

export default function RewardHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: history, isLoading } = useQuery({
    queryKey: ["all-reward-history", searchTerm],
    queryFn: () => rewardService.getHistory({ search: searchTerm }),
  });

  const columns = [
    { 
      header: "Customer", 
      accessor: "customer_name",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.customer_name}</span>
          <span className="text-[10px] text-muted-foreground">ID: #{row.customer}</span>
        </div>
      )
    },
    { 
      header: "Type", 
      accessor: "transaction_type", 
      cell: (row) => <Badge variant="secondary">{row.transaction_type}</Badge> 
    },
    { 
      header: "Amount", 
      accessor: "amount", 
      cell: (row) => (
        <span className={row.amount >= 0 ? "text-emerald-500 font-bold" : "text-destructive font-bold"}>
          {row.amount >= 0 ? "+" : ""}{row.amount}
        </span>
      )
    },
    { header: "Description", accessor: "description" },
    { 
      header: "Processed By", 
      accessor: "processed_by_name",
      cell: (row) => <span className="text-xs">{row.processed_by_name || "System"}</span>
    },
    { header: "Date", accessor: "created_at", cell: (row) => new Date(row.created_at).toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Transaction History</h1>
        <p className="text-muted-foreground mt-1">Audit log of all reward and balance adjustments.</p>
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
        <div className="flex items-center relative max-w-sm">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DataTable 
          columns={columns} 
          data={history?.results || []} 
          isLoading={isLoading}
          emptyMessage="No history found"
        />
      </div>
    </div>
  );
}
