import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Scan, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { attendanceService } from "@/services/attendance.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QRScanner() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    const onScanSuccess = async (decodedText) => {
      try {
        setScanning(false);
        scanner.clear();
        
        // Redirect to check-in page with the QR token
        toast.success("QR Code scanned! Proceeding to check-in...");
        navigate(`/attendance/check-in?token=${encodeURIComponent(decodedText)}`);
      } catch (error) {
        console.error("QR Scan error:", error);
        toast.error("Failed to process QR Code. Please try again.");
        setScanning(true);
      }
    };

    const onScanFailure = (error) => {
      // Quietly log scanning failures (happens when no QR is in view)
      // console.warn(`Code scan error = ${error}`);
    };

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Scanner clear error", err));
      }
    };
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/attendance")}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Button>

      <Card className="shadow-lg border-primary/20 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Scan size={24} />
            </div>
            <div>
              <CardTitle className="text-xl">Scan Store QR Code</CardTitle>
              <CardDescription>Position the QR code within the frame to verify attendance</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="aspect-square w-full relative bg-black">
            <div id="qr-reader" className="w-full h-full"></div>
            
            {!scanning && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                <p className="font-medium">Verifying code...</p>
              </div>
            )}
          </div>
        </CardContent>

        <div className="p-6 bg-muted/30 border-t">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">!</div>
            <p>Ensure you have granted camera permissions. QR codes are valid for a limited time and must be scanned at the physical store location.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
