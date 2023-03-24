export const iconContent = new Map<string, string>();
const requests = new Map<string, Promise<any>>();

export function getSvgContent(url: string) {
  // see if we already have a request for this url
  let request = requests.get(url);

  if (request === undefined) {
    // we don't already have a request
    // @ts-expect-error @todo TODO: Fix this error
    request = fetch(url).then(response => {
      if (response.ok) {
        return response.text().then(svgContent => {
          iconContent.set(url, svgContent);
          return svgContent;
        });
      }
      iconContent.set(url, "");
    });

    // cache for the same requests
    requests.set(url, request);
  }

  return request;
}
