import { useEffect, useState } from "react"
import { Coordinates } from "../api/types"

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true
  });

  const getLocation = () => {
    setLocationData((prev) => ({ ...prev, isLoading: true, error: null }))

    if (!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        error: "Geolokasi tidak didukung oleh browser ini.",
        isLoading: false
      })
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLocationData({
        coordinates: {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        },
        error: null,
        isLoading: false
      })
    }, (error) => {
      let errorMessage: string;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            "Izin lokasi ditolak. Harap aktifkan akses lokasi.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Informasi lokasi tidak tersedia.";
          break;
        case error.TIMEOUT:
          errorMessage = "Permintaan lokasi timed out.";
          break;
        default:
          errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      }

      setLocationData({
        coordinates: null,
        error: errorMessage,
        isLoading: false
      })
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
  };

  useEffect(() => {
    getLocation();
  }, [])

  return {
    ...locationData,
    getLocation
  }

}