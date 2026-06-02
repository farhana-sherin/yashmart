import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Download, Calendar } from "lucide-react";
import { attendanceService } from "@/services/attendance.service";
import DataTable from "@/components/tables/DataTable";
import AttendanceStatusBadge from "@/components/attendance/AttendanceStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageLoader from "@/components/loaders/PageLoader";

export default function AttendanceHistory() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    date_from: "",
    date_to: "",
  });

  const { data: history, isLoading } = useQuery({
    queryKey: ["attendance-history", filters],
    queryFn: () => attendanceService.getHistory(filters),
  });

  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Staff Name", accessor: "staff_name" },
    { 
      header: "Status", 
      accessor: "status",
      cell: (row) => <AttendanceStatusBadge status={row.status} />
    },
    { header: "Check In", accessor: "check_in_time" },
    { header: "Check Out", accessor: "check_out_time" },
    { header: "Total Hours", accessor: "total_hours" },
  ];

  const handleExport = () => {
    // Logic to export as CSV/Excel
    console.log("Exporting attendance history...");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
          <p className="text-muted-foreground mt-1">View and filter historical attendance logs.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download size={18} /> Export Data
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search staff..." 
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select 
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
          </select>
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="date" 
            className="pl-9"
            value={filters.date_from}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="date" 
            className="pl-9"
            value={filters.date_to}
            onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="bg-card rounded-xl border shadow-sm">
          <DataTable 
            columns={columns} 
            data={Array.isArray(history?.data) ? history?.data : (history?.data?.results || [])}
            emptyMessage="No attendance records found"
            emptyDescription="Try adjusting your filters to see more results."
          />
        </div>
      )}
    </div>
  );
}
