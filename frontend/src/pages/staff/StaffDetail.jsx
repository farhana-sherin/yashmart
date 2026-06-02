import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Calendar, User, Mail, Phone, Briefcase, History, Clock, CheckCircle, XCircle, Percent } from "lucide-react";
import { useStaff } from "@/hooks/useStaff";
import PageLoader from "@/components/loaders/PageLoader";
import DataTable from "@/components/tables/DataTable";
import Badge from "@/components/ui/Badge";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";

export default function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useGetStaff, useGetStaffAttendance, useGetStaffStatistics } = useStaff();

  const { data: staff, isLoading: isStaffLoading } = useGetStaff(id);
  const { data: attendanceData, isLoading: isAttendanceLoading } = useGetStaffAttendance(id);
  const { data: stats, isLoading: isStatsLoading } = useGetStaffStatistics(id);

  const columns = [
    {
      header: "Date",
      accessor: "date",
      cell: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => {
        let variant = "secondary";
        if (row.status === "PRESENT") variant = "success";
        if (row.status === "LATE") variant = "warning";
        if (row.status === "HALFDAY") variant = "info";
        if (row.status === "ABSENT") variant = "destructive";
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      header: "Check-In",
      accessor: "check_in_time",
      cell: (row) => row.check_in_time || "-",
    },
    {
      header: "Check-Out",
      accessor: "check_out_time",
      cell: (row) => row.check_out_time || "-",
    },
    {
      header: "Working Hours",
      accessor: "total_hours",
      cell: (row) => row.total_hours ? `${row.total_hours} hrs` : "-",
    },
  ];

  if (isStaffLoading || isStatsLoading) return <PageLoader />;

  const attendanceList = attendanceData?.data || attendanceData?.results || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate("/staff")}>
          <ArrowLeft size={18} /> Back to Staff
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => navigate(`/staff/${id}/edit`)}>
          <Edit size={18} /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Staff Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
            <div className="flex flex-col items-center text-center pb-6 border-b">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl mb-4">
                {staff?.full_name?.split(" ").map(n => n[0]).join("") || "S"}
              </div>
              <h2 className="text-xl font-bold">{staff?.full_name}</h2>
              <span className="text-sm text-muted-foreground mt-1">{staff?.designation || "Staff"}</span>
              <Badge variant={staff?.is_active ? "success" : "secondary"} className="mt-3">
                {staff?.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Employee Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User size={16} className="text-muted-foreground" />
                  <span className="font-medium">Employee ID:</span>
                  <span className="ml-auto text-muted-foreground">{staff?.employee_id}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-auto text-muted-foreground break-all">{staff?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-auto text-muted-foreground">{staff?.phone || "-"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase size={16} className="text-muted-foreground" />
                  <span className="font-medium">Department:</span>
                  <span className="ml-auto text-muted-foreground">{staff?.department || "-"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span className="font-medium">Joining Date:</span>
                  <span className="ml-auto text-muted-foreground">{staff?.joining_date ? new Date(staff?.joining_date).toLocaleDateString() : "-"}</span>
                </div>
              </div>
            </div>

            {staff?.notes && (
              <div className="pt-4 border-t space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Notes</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{staff?.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Stats & Attendance History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              title="Present Days"
              value={stats?.present_count || 0}
              icon={CheckCircle}
              className="border-emerald-500/20"
            />
            <StatsCard
              title="Absent Days"
              value={stats?.absent_count || 0}
              icon={XCircle}
              className="border-red-500/20"
            />
            <StatsCard
              title="Late Arrivals"
              value={stats?.late_count || 0}
              icon={Clock}
              className="border-amber-500/20"
            />
            <StatsCard
              title="Attendance Rate"
              value={`${stats?.attendance_rate || 0}%`}
              icon={Percent}
              className="border-primary/20"
            />
          </div>

          {/* Attendance History */}
          <div className="bg-card rounded-xl border shadow-sm flex flex-col">
            <div className="p-6 border-b flex items-center gap-2">
              <History size={20} className="text-muted-foreground" />
              <h3 className="text-lg font-bold">Attendance History</h3>
            </div>
            <div className="p-6">
              <DataTable
                columns={columns}
                data={attendanceList}
                isLoading={isAttendanceLoading}
                emptyMessage="No attendance logs found for this staff member."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
