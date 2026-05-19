import Badge from "@/components/ui/Badge";

export default function AttendanceStatusBadge({ status }) {
  const getVariant = (status) => {
    switch (status?.toUpperCase()) {
      case "PRESENT":
        return "success";
      case "LATE":
        return "warning";
      case "ABSENT":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {status || "UNKNOWN"}
    </Badge>
  );
}
