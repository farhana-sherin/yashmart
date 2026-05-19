import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerService } from "@/services/customer.service";
import CustomerForm from "@/components/customers/CustomerForm";
import { Button } from "@/components/ui/button";

export default function CustomerCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: customerService.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      toast.success("Customer created successfully");
      navigate("/customers");
    },
    onError: (err) => {
      const serverMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;
      
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : "Validation failed");
      } else {
        toast.error(serverMessage || "Failed to create customer");
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/customers")}>
        <ArrowLeft size={18} /> Back to Customers
      </Button>

      <div className="bg-card p-8 rounded-xl border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Customer</h1>
            <p className="text-muted-foreground">Enter customer details to register them in the system.</p>
          </div>
        </div>

        <CustomerForm 
          onSubmit={(data) => mutation.mutate(data)} 
          isLoading={mutation.isPending} 
        />
      </div>
    </div>
  );
}
