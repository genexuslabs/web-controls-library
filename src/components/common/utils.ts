import { Component } from "./interfaces";

export function debounce(
  func: () => void,
  wait: number,
  immediate = false
): () => void {
  let timeout;
  return function(...args) {
    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }.bind(this);
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(this, args);
    }
  };
}

/*  This functions overrides a method adding calls before (`before()`) and
    after (`after()`) 
*/
export function overrideMethod(
  component: Component,
  methodName: string,
  { before, after }: { before?: () => void; after?: () => void }
) {
  const oldMethod = component[methodName];
  component[methodName] = () => {
    if (before !== undefined) {
      before();
    }

    if (oldMethod !== undefined) {
      oldMethod.call(component);
    }

    if (after !== undefined) {
      after();
    }
  };
}

export function getFileNameWithoutExtension(filePath: string) {
  let lastSlashIndex = filePath.lastIndexOf("/");

  // If the function is call in the same folder of the file
  if (lastSlashIndex === -1) {
    lastSlashIndex = 0;
  }

  // We store the fileName that could have extension (+1 removes the last slash)
  const fileName = filePath.substring(lastSlashIndex + 1);

  const extensionIndex = fileName.lastIndexOf(".");

  // If the file does not have extension
  if (extensionIndex === -1) {
    return fileName;
  }

  // Returns the name between the last "/" and the last "." of the `fileName`
  return fileName.substring(0, extensionIndex);
}
