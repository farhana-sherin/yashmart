import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/services/staff.service";
import { toast } from "sonner";

export const useStaff = (params = {}) => {
  const queryClient = useQueryClient();

  const useGetStaffs = () => useQuery({
    queryKey: ["staffs", params],
    queryFn: () => staffService.getStaffs(params),
  });

  const useGetStaff = (id) => useQuery({
    queryKey: ["staff", id],
    queryFn: () => staffService.getStaff(id),
    enabled: !!id,
  });

  const useCreateStaff = () => useMutation({
    mutationFn: staffService.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]);
      toast.success("Staff created successfully");
    },
  });

  const useUpdateStaff = (id) => useMutation({
    mutationFn: (data) => staffService.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]);
      queryClient.invalidateQueries(["staff", id]);
      toast.success("Staff updated successfully");
    },
  });

  const useDeleteStaff = () => useMutation({
    mutationFn: staffService.deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]);
      toast.success("Staff deleted successfully");
    },
  });

  const useGetStaffAttendance = (id, attParams = {}) => useQuery({
    queryKey: ["staff-attendance", id, attParams],
    queryFn: () => staffService.getStaffAttendance(id, attParams),
    enabled: !!id,
  });

  const useGetStaffStatistics = (id) => useQuery({
    queryKey: ["staff-statistics", id],
    queryFn: () => staffService.getStaffStatistics(id),
    enabled: !!id,
  });

  return {
    useGetStaffs,
    useGetStaff,
    useCreateStaff,
    useUpdateStaff,
    useDeleteStaff,
    useGetStaffAttendance,
    useGetStaffStatistics,
  };
};
