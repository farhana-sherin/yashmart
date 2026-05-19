import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { attendanceService } from "@/services/attendance.service";
import { useLocation } from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/loaders/Spinner";
import LocationStatus from "@/components/attendance/LocationStatus";

export default function CheckOut() {
  const navigate = useNavigate();
  const { location, error: locationError, loading: locationLoading, getLocation } = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckOut = async () => {
    try {
      setIsSubmitting(true);
      
      let currentLoc = location;
      if (!currentLoc) {
        currentLoc = await getLocation();
      }

      const payload = {
        latitude: parseFloat(currentLoc.latitude.toFixed(6)),
        longitude: parseFloat(currentLoc.longitude.toFixed(6))
      };

      const response = await attendanceService.checkOut(payload);
      
      if (response.success) {
        toast.success(response.message || "Checked out successfully!");
        navigate("/attendance");
      } else {
        toast.error(response.message || "Check-out failed");
      }
    } catch (error) {
      console.error("Check-out error:", error);
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || error.message || "Check-out failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/attendance")}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Button>

      <Card className="border-t-4 border-t-amber-500 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center text-amber-500 mb-4">
            <LogOut size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">Staff Check-Out</CardTitle>
          <CardDescription>Finished for the day? Remember to check out.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 py-6 text-center">
          <div className="bg-muted/30 p-6 rounded-xl border border-dashed border-muted flex flex-col items-center text-center">
            <LocationStatus location={location} error={locationError} loading={locationLoading} />
            {!location && !locationLoading && (
              <Button variant="outline" size="sm" className="mt-4" onClick={getLocation}>
                Refresh Location
              </Button>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 py-4">
            <Clock size={48} className="text-muted-foreground animate-pulse" />
            <div className="space-y-1">
              <p className="text-lg font-medium">Ready to wrap up?</p>
              <p className="text-sm text-muted-foreground">Location verification is required to finalize your working hours.</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button 
            variant="secondary"
            className="w-full h-12 text-lg font-semibold bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-md"
            disabled={!location || isSubmitting}
            onClick={handleCheckOut}
          >
            {isSubmitting ? <Spinner className="mr-2" /> : "Confirm Check-Out"}
          </Button>
          
          <p className="text-center text-xs text-muted-foreground italic">
            "Hard work pays off. Have a great evening!"
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
