export function watchPosition(
  success: PositionCallback,
  error: PositionErrorCallback,
  options: PositionOptions
) {
  return navigator.geolocation.watchPosition(success, error, options);
}
