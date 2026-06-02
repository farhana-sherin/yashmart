import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import DataTable from "@/components/tables/DataTable";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";

export default function StaffTable({ data, isLoading, onDelete }) {
  const navigate = useNavigate();

  const columns = [
    {
      header: "Staff Member",
      accessor: "full_name",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.full_name}</span>
          <span className="text-xs text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    { header: "Phone", accessor: "phone" },
    { header: "Department", accessor: "department" },
    { header: "Designation", accessor: "designation" },
    {
      header: "Status",
      accessor: "is_active",
      cell: (row) => (
        <Badge variant={row.is_active ? "success" : "secondary"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Today's Attendance",
      accessor: "today_attendance.status",
      cell: (row) => {
        const status = row.today_attendance?.status || "ABSENT";
        let variant = "secondary";
        if (status === "PRESENT") variant = "success";
        if (status === "LATE") variant = "warning";
        if (status === "HALFDAY") variant = "info";
        if (status === "ABSENT") variant = "destructive";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      header: "Check-In",
      accessor: "today_attendance.check_in",
      cell: (row) => row.today_attendance?.check_in || "-",
    },
    {
      header: "Check-Out",
      accessor: "today_attendance.check_out",
      cell: (row) => row.today_attendance?.check_out || "-",
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/staff/${row.id}`)}
            title="View Profile & Attendance"
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/staff/${row.id}/edit`)}
            title="Edit Staff"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(row.id)}
            title="Deactivate Staff"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No staff members found"
    />
  );
}
