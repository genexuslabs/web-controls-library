export function parseCoords(coord): string[] {
  const regExp = /^(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)$/;
  const result = regExp.exec(coord);
  if (result !== null) {
    return result.slice(1);
  } else {
    //it's geopoint/geostring type
    let geoObject;
    try {
      geoObject = JSON.parse(coord);
    } catch (e) {
      throw new Error(e);
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
        /*
        default:
          throw new Error('Invalid GeoJSON object.');
          */
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
  }
}
