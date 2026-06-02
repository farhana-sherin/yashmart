import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, UserCheck, UserMinus, Clock, Percent } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { staffService } from "@/services/staff.service";
import { attendanceService } from "@/services/attendance.service";
import StaffTable from "@/components/staff/StaffTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function StaffList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const { data: staffs, isLoading } = useQuery({
    queryKey: ["staffs", searchTerm, deptFilter, statusFilter],
    queryFn: () => staffService.getStaffs({ 
      search: searchTerm, 
      department: deptFilter,
      is_active: statusFilter === "" ? undefined : statusFilter === "active"
    }),
  });

  const { data: attendanceStats } = useQuery({
    queryKey: ["attendance-stats-admin"],
    queryFn: attendanceService.getStatistics,
  });

  const deleteMutation = useMutation({
    mutationFn: staffService.deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffs"]);
      queryClient.invalidateQueries(["attendance-stats-admin"]);
      toast.success("Staff member deactivated successfully");
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to deactivate staff member");
    },
  });

  const stats = attendanceStats?.data || {};
  const totalStaffCount = staffs?.total_count || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Management</h1>
          <p className="text-muted-foreground mt-1">Manage supermarket employees, roles, profiles and today's attendance.</p>
        </div>
        <Button onClick={() => navigate("/staff/create")} className="gap-2">
          <Plus size={18} /> Add Staff Member
        </Button>
      </div>

      {/* Staff Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Total Staff"
          value={totalStaffCount}
          icon={Users}
          className="border-primary/20"
        />
        <StatsCard
          title="Present Today"
          value={stats.present_count ?? 0}
          icon={UserCheck}
          className="border-emerald-500/20"
        />
        <StatsCard
          title="Absent Today"
          value={stats.absent_count ?? 0}
          icon={UserMinus}
          className="border-rose-500/20"
        />
        <StatsCard
          title="Late Arrivals"
          value={stats.late_count ?? 0}
          icon={Clock}
          className="border-amber-500/20"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendance_rate ?? 0}%`}
          icon={Percent}
          className="border-purple-500/20"
        />
      </div>

      {/* Filters and Table */}
      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, employee ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Departments</option>
            <option value="Management">Management</option>
            <option value="Billing">Billing</option>
            <option value="Inventory">Inventory</option>
            <option value="Sales">Sales</option>
            <option value="Customer Service">Customer Service</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <StaffTable
          data={staffs?.results || []}
          isLoading={isLoading}
          onDelete={(id) => setDeleteId(id)}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Deactivate Staff Member"
        description="Are you sure you want to deactivate this staff member? They will not be able to check-in or access the app."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
