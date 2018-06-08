export function findTargetControl(el: HTMLElement): HTMLElement {
  if (el.hasAttribute("data-gx-le-drop-area")) {
    return el;
  }

  while (el) {
    const parent = el.parentElement;
    if (parent && parent.hasAttribute("data-gx-le-drop-area")) {
      return parent;
    }
    el = parent;
  }
}

export function getCellData(el: HTMLElement): ICellData {
  return {
    cellId: el.getAttribute("data-gx-le-cell-id"),
    dropArea: el.getAttribute("data-gx-le-drop-area"),
    rowId: el.getAttribute("data-gx-le-row-id")
  };
}

export function getDropTargetData(el: HTMLElement): IDropTargetData {
  return {
    nextRowId: el.getAttribute("data-gx-le-next-row-id"),
    placeholderType: el.getAttribute("data-gx-le-placeholder")
  };
}

interface ICellData {
  cellId: string;
  dropArea: string;
  rowId: string;
}

interface IDropTargetData {
  nextRowId: string;
  placeholderType: string;
}
