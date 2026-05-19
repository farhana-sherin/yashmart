import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customer.service";
import { toast } from "sonner";

export const useCustomers = (params = {}) => {
  const queryClient = useQueryClient();

  const useGetCustomers = () => useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerService.getCustomers(params),
  });

  const useGetCustomer = (id) => useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,
  });

  const useCreateCustomer = () => useMutation({
    mutationFn: customerService.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      toast.success("Customer created successfully");
    },
  });

  const useUpdateCustomer = (id) => useMutation({
    mutationFn: (data) => customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      queryClient.invalidateQueries(["customer", id]);
      toast.success("Customer updated successfully");
    },
  });

  const useDeleteCustomer = () => useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      toast.success("Customer deleted successfully");
    },
  });

  return {
    useGetCustomers,
    useGetCustomer,
    useCreateCustomer,
    useUpdateCustomer,
    useDeleteCustomer,
  };
};
