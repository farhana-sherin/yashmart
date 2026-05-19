import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/common/EmptyState";
import { Spinner } from "@/components/loaders/Spinner";

export default function DataTable({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found",
  emptyDescription = "There are no records to display.",
  onRowClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Search logic
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sorting logic
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border rounded-xl bg-card">
        <Spinner className="w-8 h-8 mb-4 text-primary" />
        <p className="text-muted-foreground text-sm">Loading data...</p>
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return <EmptyState title={emptyMessage} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search all columns..."
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
          />
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    className="px-4 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors select-none"
                    onClick={() => requestSort(col.accessor)}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {sortConfig.key === col.accessor && (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id || index}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={cn(
                      "bg-card transition-colors",
                      onRowClick ? "cursor-pointer hover:bg-muted/50" : "hover:bg-muted/30"
                    )}
                  >
                    {columns.map((col) => (
                      <td key={col.accessor} className="px-4 py-3 text-foreground whitespace-nowrap">
                        {col.cell ? col.cell(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                    No matching results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
          <span className="text-sm text-muted-foreground">
            Showing {paginatedData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}