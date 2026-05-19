import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Gift, DollarSign, RefreshCw, History } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerService } from "@/services/customer.service";
import { rewardService } from "@/services/reward.service";
import CustomerDetailsCard from "@/components/customers/CustomerDetailsCard";
import RewardActionModal from "@/components/rewards/RewardActionModal";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/loaders/PageLoader";
import DataTable from "@/components/tables/DataTable";
import Badge from "@/components/ui/Badge";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState({ type: null, isOpen: false });

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.getCustomer(id),
  });

  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["reward-history", id],
    queryFn: () => rewardService.getHistory({ customer: id }),
  });

  const rewardMutation = useMutation({
    mutationFn: (data) => {
      if (modalState.type === "points") return rewardService.addPoints(data);
      if (modalState.type === "balance") return rewardService.addBalance(data);
      if (modalState.type === "convert") return rewardService.convertBalance(data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["customer", id]);
      queryClient.invalidateQueries(["reward-history", id]);
      toast.success(res.message || "Action successful");
      setModalState({ type: null, isOpen: false });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Action failed");
    },
  });

  const handleAction = (value) => {
    const payload = { customer_id: id }; // Backend expects customer_id
    if (modalState.type === "points") payload.points = parseInt(value);
    if (modalState.type === "balance") payload.amount = parseFloat(value); // Backend expects amount
    
    rewardMutation.mutate(payload);
  };

  const columns = [
    { 
      header: "Type", 
      accessor: "transaction_type", 
      cell: (row) => (
        <Badge variant={row.transaction_type.includes('ADD') ? 'success' : 'secondary'}>
          {row.transaction_type.replace('_', ' ')}
        </Badge>
      ) 
    },
    { 
      header: "Value", 
      accessor: "points", 
      cell: (row) => {
        const isPoint = row.transaction_type.includes('POINT') || row.transaction_type === 'CONVERT';
        const val = isPoint ? row.points : row.balance;
        return (
          <span className="font-bold flex items-center gap-1">
            {isPoint ? <Gift size={14} className="text-emerald-500" /> : <DollarSign size={14} className="text-amber-500" />}
            {val}
          </span>
        );
      }
    },
    { header: "Remarks", accessor: "remarks" },
    { header: "Date", accessor: "created_at", cell: (row) => new Date(row.created_at).toLocaleString() },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate("/customers")}>
          <ArrowLeft size={18} /> Back to Customers
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => navigate(`/customers/${id}/edit`)}>
          <Edit size={18} /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <CustomerDetailsCard customer={customer} />
          
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Reward Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="secondary" 
                className="justify-start gap-3 h-11"
                onClick={() => setModalState({ type: "points", isOpen: true })}
              >
                <Gift size={18} className="text-emerald-500" /> Add Points
              </Button>
              <Button 
                variant="secondary" 
                className="justify-start gap-3 h-11"
                onClick={() => setModalState({ type: "balance", isOpen: true })}
              >
                <DollarSign size={18} className="text-amber-500" /> Add Balance
              </Button>
              <Button 
                variant="secondary" 
                className="justify-start gap-3 h-11"
                onClick={() => setModalState({ type: "convert", isOpen: true })}
              >
                <RefreshCw size={18} className="text-primary" /> Convert Balance
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border shadow-sm h-full flex flex-col">
            <div className="p-6 border-b flex items-center gap-2">
              <History size={20} className="text-muted-foreground" />
              <h3 className="text-lg font-bold">Transaction History</h3>
            </div>
            <div className="p-6 flex-1">
              <DataTable 
                columns={columns} 
                data={history?.results || []} 
                isLoading={isHistoryLoading}
                emptyMessage="No transactions yet"
              />
            </div>
          </div>
        </div>
      </div>

      <RewardActionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ type: null, isOpen: false })}
        title={
          modalState.type === "points" ? "Add Reward Points" : 
          modalState.type === "balance" ? "Add Pending Balance" : "Convert Balance to Points"
        }
        label={
          modalState.type === "points" ? "Points to Add" : 
          modalState.type === "balance" ? "Balance Amount ($)" : "Confirm conversion of total balance?"
        }
        type={modalState.type === "convert" ? "text" : "number"}
        onSubmit={handleAction}
        isLoading={rewardMutation.isPending}
      />
    </div>
  );
}
