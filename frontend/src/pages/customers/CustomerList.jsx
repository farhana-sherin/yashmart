import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerService } from "@/services/customer.service";
import CustomerTable from "@/components/customers/CustomerTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function CustomerList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers", searchTerm],
    queryFn: () => customerService.getCustomers({ search: searchTerm }),
  });

  const deleteMutation = useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      toast.success("Customer deleted successfully");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete customer");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your supermarket customers and their rewards.</p>
        </div>
        <Button onClick={() => navigate("/customers/create")} className="gap-2">
          <Plus size={18} /> Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Customers"
          value={customers?.total_count || 0}
          icon={Users}
        />
        {/* Add more relevant stats here if needed */}
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
        <div className="flex items-center relative max-w-sm">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CustomerTable
          data={customers?.results || []}
          isLoading={isLoading}
          onDelete={(id) => setDeleteId(id)}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
