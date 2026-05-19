import { useState } from "react";
import { FileText, Download, TrendingUp, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance.service";
import AttendanceChart from "@/components/attendance/AttendanceChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/tables/DataTable";
import PageLoader from "@/components/loaders/PageLoader";

export default function AttendanceReport() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const { data: report, isLoading } = useQuery({
    queryKey: ["attendance-report", month],
    queryFn: () => attendanceService.getMonthlyReport({ month }),
  });

  const columns = [
    { header: "Staff Name", accessor: "name" },
    { header: "Present", accessor: "present" },
    { header: "Absent", accessor: "absent" },
    { header: "Late", accessor: "late" },
    { header: "Total Days", accessor: "total" },
    { 
      header: "Performance", 
      accessor: "rate",
      cell: (row) => (
        <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: `${row.rate}%` }}
          />
        </div>
      )
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Monthly Attendance Report</h1>
          <p className="text-muted-foreground mt-1">Detailed staff performance metrics for {new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="month" 
            className="px-4 py-2 border rounded-lg bg-card"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <Button variant="outline" className="gap-2">
            <Download size={18} /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart 
          title="Daily Attendance Distribution" 
          description="Number of staff present per day this month."
          data={[]} 
        />
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Highest Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-500">98%</p>
              <p className="text-xs text-muted-foreground mt-1">Admin Staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lowest Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">72%</p>
              <p className="text-xs text-muted-foreground mt-1">Maintenance Team</p>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp size={20} />
                <span className="text-lg font-semibold">5% increase in attendance rate this month</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <DataTable 
          columns={columns} 
          data={report?.data || []}
          emptyMessage="No report data found for this month"
        />
      </div>
    </div>
  );
}
