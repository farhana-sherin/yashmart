import { useQuery } from "@tanstack/react-query";
import { Users, Search, Mail, Phone } from "lucide-react";
import { attendanceService } from "@/services/attendance.service";
import DataTable from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageLoader from "@/components/loaders/PageLoader";

export default function StaffAttendance() {
  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff-list"],
    queryFn: () => attendanceService.getHistory({}), // Placeholder for staff list API
  });

  const columns = [
    { 
      header: "Staff Member", 
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {row.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      )
    },
    { header: "Role", accessor: "role" },
    { header: "Contact", accessor: "phone" },
    { 
      header: "Today", 
      accessor: "today_status",
      cell: (row) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
          Present
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
          View Details
        </Button>
      )
    }
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground mt-1">Monitor individual staff attendance and performance.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, role or email..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Mail size={16} /> Notify Absent
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <DataTable 
          columns={columns} 
          data={[]} // Placeholder data
          emptyMessage="No staff members found"
        />
      </div>
    </div>
  );
}
