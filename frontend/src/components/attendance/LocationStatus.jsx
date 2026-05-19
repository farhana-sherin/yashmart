import { MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LocationStatus({ location, error, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
        <MapPin className="w-4 h-4" />
        Fetching location...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (location) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>Location verified: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="w-4 h-4" />
      Location required for check-in
    </div>
  );
}
