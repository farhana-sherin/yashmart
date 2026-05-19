import { useState, useCallback } from "react";

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = "Geolocation is not supported by your browser";
        setError(errorMsg);
        reject(errorMsg);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: Number(position.coords.latitude),
            longitude: Number(position.coords.longitude),
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          console.log("DEBUG: Geolocation Success:", loc);
          setLocation(loc);
          setLoading(false);
          resolve(loc);
        },
        (error) => {
          console.error("DEBUG: Geolocation Error:", error);
          let errorMsg = "Unable to retrieve your location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Location permission denied. Please enable it to check-in.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information is unavailable. Check your GPS/Signal.";
              break;
            case error.TIMEOUT:
              errorMsg = "Location request timed out. Please try again.";
              break;
            default:
              errorMsg = error.message || "An unknown location error occurred.";
          }
          setError(errorMsg);
          setLoading(false);
          reject(errorMsg);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 0 
        }
      );
    });
  }, []);

  return { location, error, loading, getLocation };
};
