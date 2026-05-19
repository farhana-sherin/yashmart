import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardService } from "@/services/reward.service";
import { toast } from "sonner";

export const useRewards = () => {
  const queryClient = useQueryClient();

  const useGetHistory = (params = {}) => useQuery({
    queryKey: ["reward-history", params],
    queryFn: () => rewardService.getHistory(params),
  });

  const useGetCustomerRewards = (id) => useQuery({
    queryKey: ["customer-rewards", id],
    queryFn: () => rewardService.getCustomerRewards(id),
    enabled: !!id,
  });

  const useAddPoints = (customerId) => useMutation({
    mutationFn: rewardService.addPoints,
    onSuccess: () => {
      queryClient.invalidateQueries(["customer", customerId]);
      queryClient.invalidateQueries(["reward-history"]);
      toast.success("Points added successfully");
    },
  });

  const useAddBalance = (customerId) => useMutation({
    mutationFn: rewardService.addBalance,
    onSuccess: () => {
      queryClient.invalidateQueries(["customer", customerId]);
      queryClient.invalidateQueries(["reward-history"]);
      toast.success("Balance added successfully");
    },
  });

  const useConvertBalance = (customerId) => useMutation({
    mutationFn: rewardService.convertBalance,
    onSuccess: () => {
      queryClient.invalidateQueries(["customer", customerId]);
      queryClient.invalidateQueries(["reward-history"]);
      toast.success("Balance converted successfully");
    },
  });

  return {
    useGetHistory,
    useGetCustomerRewards,
    useAddPoints,
    useAddBalance,
    useConvertBalance,
  };
};
