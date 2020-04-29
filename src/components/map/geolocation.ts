export function watchPosition(success, error, options) {
  return navigator.geolocation.watchPosition(success, error, options);
}
