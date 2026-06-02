import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { staffService } from "@/services/staff.service";
import StaffForm from "@/components/staff/StaffForm";
import { Button } from "@/components/ui/button";

export default function StaffCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: staffService.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]);
      toast.success("Staff member created successfully");
      navigate("/staff");
    },
    onError: (err) => {
      const serverMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;
      
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : "Validation failed");
      } else {
        toast.error(serverMessage || "Failed to create staff");
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/staff")}>
        <ArrowLeft size={18} /> Back to Staff
      </Button>

      <div className="bg-card p-8 rounded-xl border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Staff Member</h1>
            <p className="text-muted-foreground">Register a new store employee/staff member into the system.</p>
          </div>
        </div>

        <StaffForm 
          onSubmit={(data) => mutation.mutate(data)} 
          isLoading={mutation.isPending} 
        />
      </div>
    </div>
  );
}
