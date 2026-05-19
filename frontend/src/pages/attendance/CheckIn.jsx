import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Scan, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "@/hooks/useLocation";
import { attendanceService } from "@/services/attendance.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import LocationStatus from "@/components/attendance/LocationStatus";
import { Spinner } from "@/components/loaders/Spinner";

export default function CheckIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qrToken = searchParams.get("token");
  const { location, error: locationError, loading: locationLoading, getLocation } = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckIn = async () => {
    try {
      setIsSubmitting(true);
      
      // Force location fetch if not already fetched
      let currentLoc = location;
      if (!currentLoc) {
        currentLoc = await getLocation();
      }

      // Backend expects max 6 decimal places for lat/lng
      const payload = {
        latitude: parseFloat(currentLoc.latitude.toFixed(6)),
        longitude: parseFloat(currentLoc.longitude.toFixed(6)),
        qr_token: qrToken || undefined
      };

      console.log("DEBUG: Check-In API Payload:", payload);

      if (isNaN(payload.latitude) || isNaN(payload.longitude)) {
        throw new Error("Invalid coordinate data. Please refresh location.");
      }

      const response = await attendanceService.checkIn(payload);
      console.log("DEBUG: Check-In API Response:", response);

      if (response.success) {
        toast.success(response.message || "Checked in successfully!");
        navigate("/attendance");
      } else {
        toast.error(response.message || "Check-in failed");
      }
    } catch (error) {
      console.error("DEBUG: Check-In Error Object:", error);
      const serverMessage = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        console.error("DEBUG: Validation Errors:", validationErrors);
        const firstError = Object.values(validationErrors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : "Invalid location data");
      } else {
        toast.error(serverMessage || error.message || "Check-in failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/attendance")}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Button>

      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-4">
            <MapPin size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">Staff Check-In</CardTitle>
          <CardDescription>Verify your location to mark attendance</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 py-6">
          <div className="bg-muted/30 p-6 rounded-xl border border-dashed border-muted flex flex-col items-center text-center">
            <LocationStatus location={location} error={locationError} loading={locationLoading} />
            {!location && !locationLoading && (
              <Button variant="outline" size="sm" className="mt-4" onClick={getLocation}>
                Refresh Location
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Scan size={16} className="text-primary" />
              Guidelines:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>Ensure GPS is enabled on your device.</li>
              <li>You must be within the store premises to check-in.</li>
              <li>Fake locations or VPNs will result in attendance failure.</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full h-12 text-lg font-semibold shadow-md"
            disabled={!location || isSubmitting}
            onClick={handleCheckIn}
          >
            {isSubmitting ? <Spinner className="mr-2" /> : "Verify & Check-In"}
          </Button>
          
          <p className="text-center text-xs text-muted-foreground">
            Current Server Time: {new Date().toLocaleTimeString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
