export function focusLeft() {
  focus(findLeft() as HTMLElement | null);
}

export function focusRight() {
  focus(findRight() as HTMLElement | null);
}

export function focusUp() {
  focus(findUp() as HTMLElement | null);
}

export function focusDown() {
  focus(findDown() as HTMLElement | null);
}

export function isForcusable() {
  return !isEditing() &&
    document.querySelectorAll(titleSelector).length > 1;
}

const rowSelector = "ytd-rich-grid-row";
const columnSelector = "ytd-rich-item-renderer";
const titleSelector = "a#video-title-link";

function isEditing() {
  return (
    document.activeElement?.getAttribute("contenteditable") == "true" ||
    document.activeElement?.tagName == "INPUT" ||
    document.activeElement?.tagName == "TEXTAREA"
  );
}

function focus(element: HTMLElement | null) {
  if (!element) {
    return;
  }

  element?.focus();

  // Immitate the focus effect because the focus ring may not be visible (by bug?)
  // and focusVisible option is not supported for now.
  element.style.border = "1px solid #aaa";
  element.style.margin = "-1px";
  element.style.outline = "none";
  const onBlur = () => {
    element.style.border = "";
    element.style.margin = "";
    element.style.outline = "";
    element?.removeEventListener("blur", onBlur);
  };
  element.addEventListener("blur", onBlur);
}

function findLeft() {
  return isActive()
    ? document.activeElement?.closest(columnSelector)?.previousElementSibling?.querySelector(titleSelector)
    : findFirst();
}

function findRight() {
  return isActive()
    ? document.activeElement?.closest(columnSelector)?.nextElementSibling?.querySelector(titleSelector)
    : findFirst();
}

function findUp() {
  return isActive()
    ? findActiveRow()?.previousElementSibling?.querySelector(`${columnSelector}:nth-child(${getActiveColumnIndex() + 1}) ${titleSelector}`)
    : findFirst();
}

function findDown() {
  return isActive()
    ? findActiveRow()?.nextElementSibling?.querySelector(`${columnSelector}:nth-child(${getActiveColumnIndex() + 1}) ${titleSelector}`)
    : findFirst();
}

function findActiveRow() {
  return document.activeElement?.closest(rowSelector);
}

function findFirst() {
  return document.querySelector(titleSelector);
}

function isActive() {
  return document.activeElement?.matches(titleSelector);
}

function getActiveColumnIndex() {
  const activeColumn = document.activeElement?.closest(columnSelector);
  if (!activeColumn) {
    return -1;
  }
  return Array.from(activeColumn?.parentElement?.children ?? []).indexOf(activeColumn);
}
