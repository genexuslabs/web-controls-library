/**
 * Validate that the given string is a LatLong format string and return a string array containing [latitude,longitude], or the result of tryParseGeoJson function if it is not
 * @param coord String indicating the point latitude and longitude with coma separated
 * @returns Array of string representing the coordinates or the result of tryParseGeoJson function
 * @example
 * INPUT 1 (LatLong string): "-34.91676309400329,-56.1701774597168"
 * OUTPUT 1: "[-34.91676309400329,-56.1701774597168]"
 *
 * INPUT 2 (Invalid value): "any text"
 * OUTPUT 2: null
 *
 * INPUT 3 (GeoJSON string): {"type":"Point","coordinates":[-56.1701774597168,-34.91676309400329]}"
 * OUTPUT 3: [-56.1701774597168, -34.91676309400329]
 */
export function parseCoords(coord: string): string[] {
  const regExp = /^(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)$/;
  const result = regExp.exec(coord);
  return result !== null ? result.slice(1) : null;
}

/**
 * Given a GeoJson string representing the coordinates, if has type property with value (Point,MultiPoint,LineString,MultiLineString,Polygon,MultiPolygon) return an array of string coordinates in [latitude,longitude] representing the coordinates, if has type property with value (FeatureCollection) returns array of string containing features
 * @param coord GeoJSON string representing the coordinates
 * @returns Array of string coordinates in [latitude,longitude] format or the GeoJson representation object
 */
/* function tryParseGeoJson(coord: string) {
  let geoObject;

  try {
    geoObject = JSON.parse(coord);
  } catch (e) {
    return null;
  }
  const hasType = geoObject.hasOwnProperty("type");
  if (hasType) {
    switch (geoObject.type) {
      case "Point":
      case "MultiPoint":
      case "LineString":
      case "MultiLineString":
      case "Polygon":
      case "MultiPolygon":
        return geoObject.coordinates;
      case "FeatureCollection":
        return geoObject.features;
    }
  } else {
    const hasGeography = geoObject.hasOwnProperty("Geography");
    if (hasGeography) {
      return geoObject;
    } else {
      const isArray =
        geoObject[0].hasOwnProperty("Geography") && Array.isArray(geoObject);
      if (isArray) {
        geoObject.IsLayersArray = true;
        return geoObject;
      }
    }
  }
  return geoObject;
} */
