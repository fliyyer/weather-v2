import { AlertTriangle, MapPin, RefreshCcw, RefreshCw } from "lucide-react"
import { Button } from "../components/ui/button"
import { useGeolocation } from "../hooks/use-geolocation"
import WeatherSkeleton from "../components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useForecastQuery, useReverseGeocdeQuery, useWeatherQuery } from "../hooks/use-weather.ts";
import CurrentWeather from "../components/current-weather";
import HourlyTemperature from "../components/hourly-tempertaure";
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";


const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocdeQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  }

  if (locationLoading) {
    return <WeatherSkeleton />
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="size-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="size-4 mr-2" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable your location to see your local weather</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="size-4 mr-2" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again</p>
          <Button onClick={handleRefresh} variant="outline" className="w-fit">
            <RefreshCw className="size-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />
  }



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Lokasi Saat Ini</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
          <RefreshCcw className={`size-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />
          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard
