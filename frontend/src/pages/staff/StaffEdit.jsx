import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { staffService } from "@/services/staff.service";
import StaffForm from "@/components/staff/StaffForm";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/loaders/PageLoader";

export default function StaffEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff", id],
    queryFn: () => staffService.getStaff(id),
  });

  const mutation = useMutation({
    mutationFn: (data) => staffService.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]);
      queryClient.invalidateQueries(["staff", id]);
      toast.success("Staff profile updated successfully");
      navigate(`/staff/${id}`);
    },
    onError: (err) => {
      const serverMessage = err.response?.data?.message;
      toast.error(serverMessage || "Failed to update staff profile");
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate(`/staff/${id}`)}>
        <ArrowLeft size={18} /> Back to Profile
      </Button>

      <div className="bg-card p-8 rounded-xl border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <UserCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Staff Profile</h1>
            <p className="text-muted-foreground">Modify details for staff member {staff?.full_name}.</p>
          </div>
        </div>

        <StaffForm 
          initialData={staff}
          onSubmit={(data) => mutation.mutate(data)} 
          isLoading={mutation.isPending} 
        />
      </div>
    </div>
  );
}
