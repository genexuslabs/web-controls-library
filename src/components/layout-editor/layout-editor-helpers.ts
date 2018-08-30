export function findParentCell(el: HTMLElement): HTMLElement {
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

export function findValidDropTarget(el: HTMLElement): HTMLElement {
  if (el.matches("gx-layout-editor-placeholder")) {
    return el;
  }

  if (el.tagName.toLowerCase() === "gx-layout-editor") {
    const dropCandidates = el.querySelectorAll(
      `:scope > div > [data-gx-le-container] > [data-gx-le-placeholder]:last-child,
       :scope > div > [data-gx-le-container] > [data-gx-le-drop-area]:last-child`
    );
    return dropCandidates[dropCandidates.length - 1] as HTMLElement;
  }

  return findParentCell(el);
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

export function isEmptyContainerDrop(el: HTMLElement): boolean {
  return (
    el.matches("gx-layout-editor-placeholder") &&
    el.parentElement &&
    el.parentElement.getAttribute("data-gx-le-container-empty") === "true"
  );
}

export function getControlId(el: HTMLElement): string {
  return el.getAttribute("data-gx-le-control-id") || "";
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
