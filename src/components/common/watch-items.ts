export const watchForItems = <T extends HTMLElement>(
  containerEl: HTMLElement,
  tagName: string,
  onChange: (el: T | undefined) => void
) => {
  if (typeof MutationObserver === "undefined") {
    return;
  }

  const mutation = new MutationObserver(mutationList => {
    onChange(getSelectedItem<T>(mutationList, tagName));
  });
  mutation.observe(containerEl, {
    childList: true,
    subtree: true
  });
  return mutation;
};

function getSelectedItem<T extends HTMLElement>(
  mutationList: MutationRecord[],
  tagName: string
): T | undefined {
  let newOption: HTMLElement | undefined;
  mutationList.forEach(mut => {
    for (let i = 0; i < mut.addedNodes.length; i++) {
      newOption = findCheckedItem(mut.addedNodes[i], tagName) || newOption;
    }
  });
  return newOption as any;
}

export function findCheckedItem(el: any, tagName: string) {
  if (el.nodeType !== 1) {
    return undefined;
  }
  const options: HTMLElement[] =
    el.tagName === tagName.toUpperCase()
      ? [el]
      : Array.from(el.querySelectorAll(tagName));

  return options.find((o: any) => o.value === el.value);
}
