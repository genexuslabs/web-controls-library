export function watchPosition(success, error, options) {
  console.log("normal function");
  return navigator.geolocation.watchPosition(success, error, options);
}
