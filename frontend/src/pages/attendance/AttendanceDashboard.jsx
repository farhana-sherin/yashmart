import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, FileText, Users, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance.service";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import AttendanceChart from "@/components/attendance/AttendanceChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AttendanceStatusBadge from "@/components/attendance/AttendanceStatusBadge";
import PageLoader from "@/components/loaders/PageLoader";
import { useAuthStore } from "@/store/auth.store";

export default function AttendanceDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["attendance-stats"],
    queryFn: attendanceService.getStatistics,
  });

  const { data: today, isLoading: todayLoading } = useQuery({
    queryKey: ["attendance-today"],
    queryFn: attendanceService.getTodayStatus,
  });

  if (statsLoading || todayLoading) return <PageLoader />;

  const attendanceTrend = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 48 },
    { name: "Wed", value: 42 },
    { name: "Thu", value: 46 },
    { name: "Fri", value: 44 },
    { name: "Sat", value: 38 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and track staff attendance records.</p>
        </div>
        <div className="flex items-center gap-3">
          {!today?.data?.check_in ? (
            <Button onClick={() => navigate("/attendance/check-in")} className="gap-2">
              <LogIn size={18} /> Check In
            </Button>
          ) : !today?.data?.check_out ? (
            <Button onClick={() => navigate("/attendance/check-out")} variant="secondary" className="gap-2">
              <LogOut size={18} /> Check Out
            </Button>
          ) : (
            <AttendanceStatusBadge status="COMPLETED" />
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <AttendanceStats statistics={stats?.data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend */}
        <div className="lg:col-span-2">
          <AttendanceChart 
            data={attendanceTrend} 
            type="line" 
            title="Weekly Attendance Trend" 
            description="Overall staff presence for the current week."
          />
        </div>

        {/* Quick Actions / Today's Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Status Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Status</span>
                <AttendanceStatusBadge status={today?.data?.status || "NOT MARKED"} />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Check In</span>
                <span className="text-sm font-medium">{today?.data?.check_in || "--:--"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Check Out</span>
                <span className="text-sm font-medium">{today?.data?.check_out || "--:--"}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="justify-start gap-3 h-12" onClick={() => navigate("/attendance/history")}>
              <History size={18} /> Attendance History
            </Button>
            {isAdmin && (
              <>
                <Button variant="outline" className="justify-start gap-3 h-12" onClick={() => navigate("/attendance/reports")}>
                  <FileText size={18} /> Monthly Reports
                </Button>
                <Button variant="outline" className="justify-start gap-3 h-12" onClick={() => navigate("/attendance/staff")}>
                  <Users size={18} /> Staff Management
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
