import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Gift, DollarSign } from "lucide-react";
import DataTable from "@/components/tables/DataTable";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";

export default function CustomerTable({ data, isLoading, onDelete }) {
  const navigate = useNavigate();

  const columns = [
    {
      header: "Customer",
      accessor: "full_name",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.full_name}</span>
          <span className="text-xs text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    { header: "Phone", accessor: "phone" },
    {
      header: "Reward Points",
      accessor: "total_points",
      cell: (row) => (
        <Badge variant="success" className="gap-1">
          <Gift size={12} /> {row.total_points || 0}
        </Badge>
      ),
    },
    {
      header: "Pending Balance",
      accessor: "pending_balance",
      cell: (row) => (
        <Badge variant="warning" className="gap-1">
          <DollarSign size={12} /> ${row.pending_balance || 0}
        </Badge>
      ),
    },
    {
      header: "Joined",
      accessor: "created_at",
      cell: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/customers/${row.id}`)}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/customers/${row.id}/edit`)}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(row.id)}
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
      emptyMessage="No customers found"
    />
  );
}
