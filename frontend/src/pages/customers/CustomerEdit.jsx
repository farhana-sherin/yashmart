import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserCog } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerService } from "@/services/customer.service";
import CustomerForm from "@/components/customers/CustomerForm";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/loaders/PageLoader";

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.getCustomer(id),
  });

  const mutation = useMutation({
    mutationFn: (data) => customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      queryClient.invalidateQueries(["customer", id]);
      toast.success("Customer updated successfully");
      navigate(`/customers/${id}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update customer");
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate(`/customers/${id}`)}>
        <ArrowLeft size={18} /> Back to Details
      </Button>

      <div className="bg-card p-8 rounded-xl border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <UserCog size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Customer</h1>
            <p className="text-muted-foreground">Update customer profile information.</p>
          </div>
        </div>

        <CustomerForm 
          initialData={customer}
          onSubmit={(data) => mutation.mutate(data)} 
          isLoading={mutation.isPending} 
        />
      </div>
    </div>
  );
}
