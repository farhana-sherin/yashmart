import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/loaders/Spinner";

export default function StaffForm({ initialData, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: initialData ? {
      full_name: initialData.data?.user?.name || initialData.user?.name || "",
      email: initialData.data?.user?.email || initialData.user?.email || "",
      phone: initialData.data?.phone || initialData.phone || "",
      department: initialData.data?.department || initialData.department || "",
      designation: initialData.data?.designation || initialData.designation || "",
      joining_date: initialData.data?.joining_date || initialData.joining_date || "",
      notes: initialData.data?.notes || initialData.notes || "",
    } : {
      full_name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      joining_date: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          placeholder="Jane Doe"
          {...register("full_name")}
        />
        {errors.full_name && (
          <p className="text-sm text-destructive">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          placeholder="9876543210"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            placeholder="Sales"
            {...register("department")}
          />
          {errors.department && (
            <p className="text-sm text-destructive">{errors.department.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            placeholder="Cashier"
            {...register("designation")}
          />
          {errors.designation && (
            <p className="text-sm text-destructive">{errors.designation.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="joining_date">Joining Date</Label>
        <Input
          id="joining_date"
          type="date"
          {...register("joining_date")}
        />
        {errors.joining_date && (
          <p className="text-sm text-destructive">{errors.joining_date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes / Details</Label>
        <Input
          id="notes"
          placeholder="Additional employee details..."
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full mt-6" disabled={isLoading}>
        {isLoading ? <Spinner className="mr-2" /> : null}
        {initialData ? "Update Staff Profile" : "Create Staff Profile"}
      </Button>
    </form>
  );
}
