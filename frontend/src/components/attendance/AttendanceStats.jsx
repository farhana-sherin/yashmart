import { UserCheck, UserMinus, Clock, Percent } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

export default function AttendanceStats({ statistics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Present"
        value={statistics?.present_count || 0}
        icon={UserCheck}
        className="border-emerald-500/20"
      />
      <StatsCard
        title="Total Absent"
        value={statistics?.absent_count || 0}
        icon={UserMinus}
        className="border-red-500/20"
      />
      <StatsCard
        title="Late Arrivals"
        value={statistics?.late_count || 0}
        icon={Clock}
        className="border-amber-500/20"
      />
      <StatsCard
        title="Attendance Rate"
        value={`${statistics?.attendance_rate || 0}%`}
        icon={Percent}
        className="border-primary/20"
      />
    </div>
  );
}
